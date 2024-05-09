export default function handler(req, res) {
  const data = { name: "John Doe" };
  res.status(200).json(data);
}
