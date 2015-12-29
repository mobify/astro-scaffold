Astro uses a controller pattern to manage the business logic of UX components. Controllers can manage a single Astro plugin or coordinate the behavior of several astro plugins which make up a single UX component in the app.

Astro defines a controller inside of a requirejs module. The module exposes a prototype object as well as a factory method (`init`) which can be used to instantiate controllers with the prototype. The `init` method returns a promise which resolves to the newly created object.
