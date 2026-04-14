import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
  return res.status(401).json({ error: "Unauthorized" });
}
  try {
    // ✅ FIXED DATE (Problem 7)
    const today = new Date().toISOString().split("T")[0];

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        due_date,
        user_id,
        profiles (email)
      `)
      .eq("status", "Pending")
      .eq("overdue_email_sent", false)
      .lt("due_date", today);

    if (error) throw error;

    if (!tasks || tasks.length === 0) {
      console.log("No overdue tasks");
      return res.status(200).json({ message: "No overdue tasks" });
    }

    console.log(`Processing ${tasks.length} overdue tasks`);

    // ✅ PROBLEM 9 FIX — PARALLEL PROCESSING
    await Promise.all(
      tasks.map(async (task) => {
        try {
          const email = task.profiles?.email;

          // ✅ Skip if no email
          if (!email) {
            console.warn(`No email for user ${task.user_id}`);
            return;
          }

          // ✅ Send email
          const emailRes = await resend.emails.send({
            from: "Task Manager <onboarding@resend.dev>",
            to: email,
            subject: "Overdue Task Reminder",
            html: `<p>Your task <b>${task.title}</b> is overdue.</p>`
          });

          // ❌ DO NOT PROCEED if email failed
          if (!emailRes || !emailRes.id) {
            console.error(`Email failed for task ${task.id}`);
            return;
          }

          // ✅ Insert notification
          const { error: notifError } = await supabase
            .from("notifications")
            .insert([
              {
                user_id: task.user_id,
                title: "Task Overdue",
                message: `${task.title} is overdue`,
                read: false
              }
            ]);

          if (notifError) {
            console.error(
              `Notification failed for task ${task.id}`,
              notifError.message
            );
          }

          // ✅ Mark as sent ONLY AFTER SUCCESS
          const { error: updateError } = await supabase
            .from("tasks")
            .update({ overdue_email_sent: true })
            .eq("id", task.id);

          if (updateError) {
            console.error("Update error:", updateError);
          }

          console.log(`Processed task ${task.id}`);
        } catch (err) {
          console.error(`Error processing task ${task.id}`, err);
        }
      })
    );

    res.status(200).json({ message: "Emails & notifications sent" });
  } catch (err) {
    console.error("Global error:", err);
    res.status(500).json({ error: err.message });
  }
}