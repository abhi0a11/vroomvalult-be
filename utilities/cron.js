import axios from "axios";

export const Cron_keep_server_alive = async (req, res) => {
  try {
    await axios.get(`${process.env.Server}`);
  } catch (error) {
    console.log(`Cron error ${error}`);
  }
};
