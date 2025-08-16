// Executive Dashboard Controller
// Implements analytics endpoints for dashboard widgets
import * as dashboardModel from '../models/dashboardModel.js';

const dashboardController = {
  // Admin Dashboard Summary (for frontend table)
  async getAdminSummary(req, res) {
    try {
      // ดึงข้อมูลรวมแบบขนาน
      const [equipment, available, borrowed, pendingRequests, lateReturns, users, categories, pendingDelivery, pendingReturn] = await Promise.all([
        dashboardModel.countEquipment(),
        dashboardModel.countAvailableEquipment(),
        dashboardModel.countBorrowedEquipment(),
        dashboardModel.countPendingRequests(),
        dashboardModel.countLateReturns(),
        dashboardModel.countUsers(),
        dashboardModel.countCategories(),
        dashboardModel.countPendingDelivery(),
        dashboardModel.countPendingReturn(),
      ]);
      res.json({
        totalEquipment: equipment,
        availableEquipment: available,
        borrowedEquipment: borrowed,
        pendingRequests,
        lateReturns,
        totalUsers: users,
        totalCategories: categories,
        pendingDelivery,
        pendingReturn
      });
    } catch (err) {
      console.error('[getAdminSummary] error:', err);
      res.status(500).json({ error: err.message });
    }
  },
  // 1. Monthly borrow count (Line Chart)
  async getMonthlyBorrow(req, res) {
    try {
      const result = await dashboardModel.getMonthlyBorrow();
      console.log('[getMonthlyBorrow] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getMonthlyBorrow] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 2. Return status breakdown (Pie Chart)
  async getReturnStatus(req, res) {
    try {
      const result = await dashboardModel.getReturnStatus();
      console.log('[getReturnStatus] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getReturnStatus] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 3. Top 5 borrowed equipment (Bar Chart)
  async getTopBorrowedEquipment(req, res) {
    try {
      const result = await dashboardModel.getTopBorrowedEquipment();
      console.log('[getTopBorrowedEquipment] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getTopBorrowedEquipment] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 4. Fine summary by type (Donut Chart)
  async getFineSummary(req, res) {
    try {
      const result = await dashboardModel.getFineSummary();
      console.log('[getFineSummary] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getFineSummary] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 5. Repair requests by status (Bar Chart)
  async getRepairStatus(req, res) {
    try {
      const result = await dashboardModel.getRepairStatus();
      console.log('[getRepairStatus] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getRepairStatus] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 6. Weekly borrow trend (Area Chart)
  async getWeeklyBorrowTrend(req, res) {
    try {
      const result = await dashboardModel.getWeeklyBorrowTrend();
      console.log('[getWeeklyBorrowTrend] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getWeeklyBorrowTrend] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 7. Next month borrow forecast (Forecast Line)
  async getBorrowForecast(req, res) {
    try {
      const result = await dashboardModel.getBorrowForecast();
      console.log('[getBorrowForecast] result:', result);
      res.json(result || { forecast: 0 });
    } catch (err) {
      console.error('[getBorrowForecast] error:', err);
      res.status(500).json({ forecast: 0 });
    }
  },

  // 8. Top 5 repeatedly damaged equipment (Table/Bar)
  async getTopDamagedEquipment(req, res) {
    try {
      const result = await dashboardModel.getTopDamagedEquipment();
      console.log('[getTopDamagedEquipment] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getTopDamagedEquipment] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 9. Top 5 users with highest fines (Table)
  async getTopRiskUsers(req, res) {
    try {
      const result = await dashboardModel.getTopRiskUsers();
      console.log('[getTopRiskUsers] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getTopRiskUsers] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 10. Total equipment value (KPI)
  async getTotalEquipmentValue(req, res) {
    try {
      const result = await dashboardModel.getTotalEquipmentValue();
      console.log('[getTotalEquipmentValue] result:', result);
      res.json(result || { total_value: 0 });
    } catch (err) {
      console.error('[getTotalEquipmentValue] error:', err);
      res.status(500).json({ total_value: 0 });
    }
  },

  // 11. Total value of damaged/lost equipment (KPI)
  async getTotalDamagedValue(req, res) {
    try {
      const result = await dashboardModel.getTotalDamagedValue();
      console.log('[getTotalDamagedValue] result:', result);
      res.json(result || { damaged_value: 0 });
    } catch (err) {
      console.error('[getTotalDamagedValue] error:', err);
      res.status(500).json({ damaged_value: 0 });
    }
  },

  // 12. Total repair cost (KPI)
  async getTotalRepairCost(req, res) {
    try {
      const result = await dashboardModel.getTotalRepairCost();
      console.log('[getTotalRepairCost] result:', result);
      res.json(result || { total_repair_cost: 0 });
    } catch (err) {
      console.error('[getTotalRepairCost] error:', err);
      res.status(500).json({ total_repair_cost: 0 });
    }
  },

  // 13. Asset depreciation (Line Chart)
  async getDepreciation(req, res) {
    try {
      const result = await dashboardModel.getDepreciation();
      console.log('[getDepreciation] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getDepreciation] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 14. Repair vs borrow ratio (Pie Chart)
  async getRepairVsBorrowRatio(req, res) {
    try {
      const result = await dashboardModel.getRepairVsBorrowRatio();
      console.log('[getRepairVsBorrowRatio] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getRepairVsBorrowRatio] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 15. Categories with highest fines (Bar Chart)
  async getTopFineCategories(req, res) {
    try {
      const result = await dashboardModel.getTopFineCategories();
      console.log('[getTopFineCategories] result:', result);
      res.json(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error('[getTopFineCategories] error:', err);
      res.status(500).json([]);
    }
  },

  // 16. Users who frequently return damaged items (Table)
  async getFrequentDamageUsers(req, res) {
    try {
      const result = await dashboardModel.getFrequentDamageUsers();
      console.log('[getFrequentDamageUsers] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getFrequentDamageUsers] error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 17. Borrow summary by branch (Bar Chart)
  async getBranchBorrowSummary(req, res) {
    try {
      const result = await dashboardModel.getBranchBorrowSummary();
      console.log('[getBranchBorrowSummary] result:', result);
      res.json(result);
    } catch (err) {
      console.error('[getBranchBorrowSummary] error:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

export default dashboardController;
