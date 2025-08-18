import FooterModel from '../models/footerModel.js';

const footerController = {
  // GET /api/footer-settings
  getFooterSettings: async (req, res) => {
    try {
      const settings = await FooterModel.getFooterSettings();
      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Error getting footer settings:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่า Footer',
        error: error.message
      });
    }
  },

  // PUT /api/footer-settings
  updateFooterSettings: async (req, res) => {
    try {
      const result = await FooterModel.updateFooterSettings(req.body);
      res.json({
        success: true,
        message: 'อัปเดตการตั้งค่า Footer สำเร็จ',
        data: result
      });
    } catch (error) {
      console.error('Error updating footer settings:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่า Footer',
        error: error.message
      });
    }
  }
};

export default footerController;