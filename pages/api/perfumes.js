import Cors from "cors";
import executeQuery from "../../lib/db";

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  // Consulta para selecionar todos os produtos da tabela "perfumes"
  const query = "SELECT id, month, day, p_id, sub_id FROM perfumes";
  const results = await executeQuery({ query });

  if (results.error) {
    res.status(500).json({ error: "Error executing the query" });
    return;
  }

  // Mapeia os resultados da consulta para um objeto com os atributos desejados
  const products = results.map((row) => ({
    id: row.id,
    month: row.month,
    day: row.day,
    p_id: row.p_id,
    sub_id: row.sub_id,
  }));


  res.status(200).json({ data: products });
}
