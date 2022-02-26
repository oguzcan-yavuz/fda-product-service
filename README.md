### Notes:

- `TYPEORM_ENTITIES` and `TYPEORM_MIGRATIONS` env variables are only used by the migration commands located in the package.json.
Because while running the CLI, the location of those files are in `src` but while configurations are loaded in the application, the scope is in the `dist` folder
So we are using that path in the configuration. Another solution would be using `ormconfig.json` but since the other values are shared and TypeOrm has the ability to parse env variables,
I didn't wanted to manage same configurations in two different places. Instead, we need to use TYPEORM env variables and keep an .env file while using the migration commands.
