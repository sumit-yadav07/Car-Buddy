import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://oerhxvytmayicjysuugd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmh4dnl0bWF5aWNqeXN1dWdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODA4MTg4MCwiZXhwIjoyMDUzNjU3ODgwfQ.HXcxqv9sEuVdkyXUyeaTNyhLViRKUp3SJFEGSnQeds0"
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  const url = new URL(req.url);
  let pathname = url.pathname.replace("/myfunction", ""); // Remove prefix if Supabase adds it
  console.log(`Adjusted request path: ${pathname}`);
  const method = req.method;

  try {
    if (pathname === "/api/users" && method === "POST") {
      // Create User
      try {
        const { email, password } = await req.json();
        if (!email || !password) throw new Error("Email and password are required");

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
          console.error("SignUp Error:", error.message);
          return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
        return new Response(JSON.stringify({ user: data }), { status: 201 });
      } catch (err) {
        console.error("User Creation Error:", err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    if (pathname === "/api/cars" && method === "POST") {
      // Create Car
      try {
        const { title, description, images, tags, user_id } = await req.json();
        if (!title || !user_id) throw new Error("Title and user_id are required");

        const { data, error } = await supabase.from("cars").insert([{ title, description, images, tags, user_id }]);

        if (error) throw new Error(error.message);
        return new Response(JSON.stringify({ car: data }), { status: 201 });
      } catch (err) {
        console.error("Car Creation Error:", err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    if (pathname === "/api/cars" && method === "GET") {
      // List Cars
      const { data, error } = await supabase.from("cars").select("*");

      if (error) throw new Error(error.message);
      return new Response(JSON.stringify(data), { status: 200 });
    }

    if (pathname.startsWith("/api/cars/") && method === "GET") {
      // Get Particular Car
      const carId = pathname.split("/").pop();
      const { data, error } = await supabase.from("cars").select("*").eq("id", carId).single();

      if (error) throw new Error(error.message);
      return new Response(JSON.stringify(data), { status: 200 });
    }

    if (pathname.startsWith("/api/cars/") && method === "PUT") {
      // Update Car
      try {
        const carId = pathname.split("/").pop();
        const updates = await req.json();

        const { data, error } = await supabase.from("cars").update(updates).eq("id", carId);

        if (error) throw new Error(error.message);
        return new Response(JSON.stringify(data), { status: 200 });
      } catch (err) {
        console.error("Car Update Error:", err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    if (pathname.startsWith("/api/cars/") && method === "DELETE") {
      // Delete Car
      try {
        const carId = pathname.split("/").pop();
        const { error } = await supabase.from("cars").delete().eq("id", carId);

        if (error) throw new Error(error.message);
        return new Response(JSON.stringify({ message: "Car deleted successfully" }), { status: 200 });
      } catch (err) {
        console.error("Car Deletion Error:", err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    if (pathname === "/api/docs" && method === "GET") {
      // API Documentation
      const apiDocs = {
        endpoints: [
          { method: "POST", path: "/api/users", description: "Create a user" },
          { method: "POST", path: "/api/cars", description: "Create a car" },
          { method: "GET", path: "/api/cars", description: "List all cars" },
          { method: "GET", path: "/api/cars/:id", description: "Get a single car" },
          { method: "PUT", path: "/api/cars/:id", description: "Update a car" },
          { method: "DELETE", path: "/api/cars/:id", description: "Delete a car" },
        ],
        authentication: "Some endpoints require authentication via Supabase Auth",
      };

      return new Response(JSON.stringify(apiDocs), { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    return new Response(JSON.stringify({ error: "Invalid Route" }), { status: 404 });
  } catch (err) {
    console.error("Unhandled Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
