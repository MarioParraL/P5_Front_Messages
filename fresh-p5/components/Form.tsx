import { FunctionalComponent } from "preact/src/index.d.ts";

const Contact: FunctionalComponent = () => {
  return (
    <div>
      <form method="post" action="/contact" class="Formulario">
        <input type="text" name="name" placeholder="nombre" required />
        <input type="text" name="email" placeholder="correo" required />
        <input type="text" name="phone" placeholder="telefono" required />
        <button type="submit">
          Añadir Contacto
        </button>
      </form>
    </div>
  );
};

export default Contact;
