import Contact from "../components/Form.tsx";
import { Handlers } from "$fresh/server.ts";

type Contacto = {
  name: string;
  email: string;
  phone: string;
};

export const handler: Handlers = {
  async POST(req: Request) {
    const form = await req.formData();
    const name = form.get("name")?.toString() || "";
    const email = form.get("email")?.toString() || "";
    const phone = form.get("phone")?.toString() || "";

    const contacto: Contacto = { name, email, phone };

    try {
      await fetch("https://back-a-p4.onrender.com/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contacto),
      });

      const url = new URL("/", req.url);
      return Response.redirect(url, 303);
    } catch (_e) {
      return new Response("Error al crear contacto", { status: 500 });
    }
  },
};

const Page = () => {
  return (
    <div>
      <Contact />
    </div>
  );
};

export default Page;
