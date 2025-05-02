const supabase = require("../services/supabaseClient");

// GET /api/teachers
exports.getTeachers = async (req, res) => {
  const { data, error } = await supabase.from("teachers").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/teachers
exports.addTeacher = async (req, res) => {
  const teacher = req.body;
  const { data, error } = await supabase.from("teachers").insert([teacher]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/teachers/:id
exports.updateTeacher = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const { data, error } = await supabase.from("teachers").update(updatedData).eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// DELETE /api/teachers/:id
exports.deleteTeacher = async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Teacher deleted successfully", data });
};

// GET /api/teachers/email/:email
exports.getTeacherByEmail = async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("❌ Supabase teacher fetch error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};
