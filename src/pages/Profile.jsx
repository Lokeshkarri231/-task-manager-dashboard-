import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email_notifications: true,
    sms_notifications: false,
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  }

  async function updateProfile() {
    await supabase
      .from("profiles")
      .update({
        name: profile.name,
        phone: profile.phone,
        email_notifications: profile.email_notifications,
        sms_notifications: profile.sms_notifications,
      })
      .eq("id", user.id);

    alert("Profile updated");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profile</h2>

      <input
        placeholder="Name"
        value={profile.name || ""}
        onChange={(e) =>
          setProfile({ ...profile, name: e.target.value })
        }
      />

      <br /><br />

      <input
        placeholder="Phone"
        value={profile.phone || ""}
        onChange={(e) =>
          setProfile({ ...profile, phone: e.target.value })
        }
      />

      <br /><br />

      <label>
        Email Notifications
        <input
          type="checkbox"
          checked={profile.email_notifications || false}
          onChange={(e) =>
            setProfile({
              ...profile,
              email_notifications: e.target.checked,
            })
          }
        />
      </label>

      <br /><br />

      <label>
        SMS Notifications
        <input
          type="checkbox"
          checked={profile.sms_notifications || false}
          onChange={(e) =>
            setProfile({
              ...profile,
              sms_notifications: e.target.checked,
            })
          }
        />
      </label>

      <br /><br />

      <button onClick={updateProfile}>Save Profile</button>
    </div>
  );
}

export default Profile;