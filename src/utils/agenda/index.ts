import Agenda from "agenda";

const mongoConnectionString =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_AGENDA_PRODUCTION
    : process.env.MONGO_AGENDA_DEV;
const db = { address: mongoConnectionString };

const agenda = new Agenda({ db });

export default agenda;
