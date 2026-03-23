import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      title,
      due_date,
      profiles ( email )
    `)
    .eq("status", "Pending")
    .lt("due_date", new Date().toISOString());

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  for (const task of data) {
    const email = task.profiles.email;

    await resend.emails.send({
      from: "Task Manager <onboarding@resend.dev>",
      to: email,
      subject: "Overdue Task Reminder",
      html: `<p>Your task <b>${task.title}</b> is overdue.</p>`
    });
  }

  res.status(200).json({ message: "Emails sent" });
}