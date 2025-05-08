// server/services/examTemplateService.js
const supabase = require("./supabaseClient");

// Tüm şablonları getir
exports.getAllTemplates = async () => {
  return await supabase
    .from("exam_templates")
    .select("*");
};

// Öğretmen bazlı şablonları getir
exports.getTemplatesByTeacherId = async (teacherId) => {
  return await supabase
    .from("exam_templates")
    .select("*")
    .eq("teacher_id", teacherId);
};

// Yeni şablon oluştur
exports.createTemplate = async ({ teacher_id, name, date }) => {
  // .select() ekleyerek insert sonrası otomatik olarak dönmesini sağlıyoruz
  return await supabase
    .from("exam_templates")
    .insert([{ teacher_id, name, date }])
    .select();
};

// Şablonu güncelle
exports.updateTemplate = async (id, data) => {
  return await supabase
    .from("exam_templates")
    .update(data)
    .eq("id", id);
};

// Şablonu sil
exports.deleteTemplate = async (id) => {
  return await supabase
    .from("exam_templates")
    .delete()
    .eq("id", id);
};

// Şablona bağlı dersleri ekle
exports.createTemplateLessons = async (lessonsArr) => {
  return await supabase
    .from("exam_template_lessons")
    .insert(lessonsArr);
};
