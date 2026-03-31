import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const today = new Date().toISOString().split("T")[0];

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, title, due_date, user_id")
    .eq("status", "Pending")
    .eq("overdue_email_sent", false)
    .lt("due_date", today);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  for (const task of tasks) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", task.user_id)
      .single();

    if (profile?.email) {
      // ✅ Send email
      await resend.emails.send({
        from: "Task Manager <onboarding@resend.dev>",
        to: profile.email,
        subject: "Overdue Task Reminder",
        html: `<p>Your task <b>${task.title}</b> is overdue.</p>`
      });

      // ✅ Insert notification
      await supabase.from("notifications").insert([
        {
          user_id: task.user_id,
          title: "Task Overdue",
          message: `${task.title} is overdue`
        }
      ]);

      // ✅ Mark email sent
      await supabase
        .from("tasks")
        .update({ overdue_email_sent: true })
        .eq("id", task.id);
    }
  }

  res.status(200).json({ message: "Emails & notifications sent" });
}