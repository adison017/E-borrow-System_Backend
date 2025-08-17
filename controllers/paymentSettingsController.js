import db from '../db.js';

async function ensureRowExists() {
  const [rows] = await db.query('SELECT id FROM payment_settings ORDER BY id ASC LIMIT 1');
  if (rows.length === 0) {
    await db.query(
      'INSERT INTO payment_settings (method, promptpay_number, bank_name, account_name, account_number) VALUES (?,?,?,?,?)',
      ['promptpay', '', '', '', '']
    );
  }
}

const paymentSettingsController = {
  // GET /api/payment-settings  (return first row)
  get: async (req, res) => {
    try {
      await ensureRowExists();
      const [rows] = await db.query(
        'SELECT method, promptpay_number, bank_name, account_name, account_number FROM payment_settings ORDER BY id ASC LIMIT 1'
      );
      const data = rows[0] || {
        method: 'promptpay',
        promptpay_number: '',
        bank_name: '',
        account_name: '',
        account_number: ''
      };
      res.json({ success: true, data });
    } catch (err) {
      console.error('payment_settings get error:', err);
      res.status(500).json({ success: false, message: 'Error fetching payment settings', error: err.message });
    }
  },

  // GET /api/payment-settings/:id (fetch by id)
  getById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [rows] = await db.query(
        'SELECT id, method, promptpay_number, bank_name, account_name, account_number, updated_at, updated_by FROM payment_settings WHERE id = ?',
        [id]
      );
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: rows[0] });
    } catch (err) {
      console.error('payment_settings getById error:', err);
      res.status(500).json({ success: false, message: 'Error fetching payment settings by id', error: err.message });
    }
  },

  // POST /api/payment-settings (create new row)
  create: async (req, res) => {
    try {
      const { method, promptpay_number, bank_name, account_name, account_number } = req.body || {};
      if (!['promptpay', 'bank'].includes(method || '')) {
        return res.status(400).json({ success: false, message: 'Invalid method. Use "promptpay" or "bank".' });
      }
      const updatedBy = req.user?.user_id || null;
      const [result] = await db.query(
        'INSERT INTO payment_settings (method, promptpay_number, bank_name, account_name, account_number, updated_by) VALUES (?,?,?,?,?,?)',
        [
          method,
          String(promptpay_number || ''),
          String(bank_name || ''),
          String(account_name || ''),
          String(account_number || ''),
          updatedBy
        ]
      );
      const [after] = await db.query('SELECT * FROM payment_settings WHERE id = ?', [result.insertId]);
      res.status(201).json({ success: true, message: 'สร้างรายการตั้งค่าชำระเงินสำเร็จ', data: after[0] });
    } catch (err) {
      console.error('payment_settings create error:', err);
      res.status(500).json({ success: false, message: 'Error creating payment settings', error: err.message });
    }
  },

  // PUT /api/payment-settings and PUT /api/payment-settings/:id (replace)
  put: async (req, res) => {
    try {
      const { method, promptpay_number, bank_name, account_name, account_number } = req.body || {};
      if (!['promptpay', 'bank'].includes(method || '')) {
        return res.status(400).json({ success: false, message: 'Invalid method. Use "promptpay" or "bank".' });
      }
      await ensureRowExists();

      let id = req.params?.id ? Number(req.params.id) : null;
      if (!id) {
        const [r] = await db.query('SELECT id FROM payment_settings ORDER BY id ASC LIMIT 1');
        id = r[0]?.id;
      }

      const updatedBy = req.user?.user_id || null;
      await db.query(
        'UPDATE payment_settings SET method = ?, promptpay_number = ?, bank_name = ?, account_name = ?, account_number = ?, updated_by = ? WHERE id = ?',
        [
          method,
          String(promptpay_number || ''),
          String(bank_name || ''),
          String(account_name || ''),
          String(account_number || ''),
          updatedBy,
          id
        ]
      );

      const [after] = await db.query(
        'SELECT method, promptpay_number, bank_name, account_name, account_number FROM payment_settings WHERE id = ?',
        [id]
      );

      res.json({ success: true, message: 'อัปเดตการตั้งค่าชำระเงินสำเร็จ', data: after[0] });
    } catch (err) {
      console.error('payment_settings update error:', err);
      res.status(500).json({ success: false, message: 'Error updating payment settings', error: err.message });
    }
  },

  // PATCH /api/payment-settings and PATCH /api/payment-settings/:id (partial update)
  patch: async (req, res) => {
    try {
      await ensureRowExists();
      let id = req.params?.id ? Number(req.params.id) : null;
      if (!id) {
        const [r] = await db.query('SELECT id FROM payment_settings ORDER BY id ASC LIMIT 1');
        id = r[0]?.id;
      }

      const [rows] = await db.query('SELECT * FROM payment_settings WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });

      const current = rows[0];
      const next = {
        method: req.body?.method ?? current.method,
        promptpay_number: req.body?.promptpay_number ?? current.promptpay_number,
        bank_name: req.body?.bank_name ?? current.bank_name,
        account_name: req.body?.account_name ?? current.account_name,
        account_number: req.body?.account_number ?? current.account_number
      };
      if (!['promptpay', 'bank'].includes(next.method || '')) {
        return res.status(400).json({ success: false, message: 'Invalid method. Use "promptpay" or "bank".' });
      }

      const updatedBy = req.user?.user_id || null;
      await db.query(
        'UPDATE payment_settings SET method = ?, promptpay_number = ?, bank_name = ?, account_name = ?, account_number = ?, updated_by = ? WHERE id = ?',
        [
          String(next.method),
          String(next.promptpay_number || ''),
          String(next.bank_name || ''),
          String(next.account_name || ''),
          String(next.account_number || ''),
          updatedBy,
          id
        ]
      );
      const [after] = await db.query('SELECT * FROM payment_settings WHERE id = ?', [id]);
      res.json({ success: true, message: 'แก้ไขการตั้งค่าชำระเงินสำเร็จ', data: after[0] });
    } catch (err) {
      console.error('payment_settings patch error:', err);
      res.status(500).json({ success: false, message: 'Error patching payment settings', error: err.message });
    }
  },

  // DELETE /api/payment-settings and DELETE /api/payment-settings/:id
  remove: async (req, res) => {
    try {
      let id = req.params?.id ? Number(req.params.id) : null;
      if (!id) {
        const [r] = await db.query('SELECT id FROM payment_settings ORDER BY id ASC LIMIT 1');
        id = r[0]?.id;
      }
      const [rows] = await db.query('SELECT id FROM payment_settings WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
      await db.query('DELETE FROM payment_settings WHERE id = ?', [id]);
      res.json({ success: true, message: 'ลบการตั้งค่าชำระเงินสำเร็จ' });
    } catch (err) {
      console.error('payment_settings delete error:', err);
      res.status(500).json({ success: false, message: 'Error deleting payment settings', error: err.message });
    }
  }
};

export default paymentSettingsController;


