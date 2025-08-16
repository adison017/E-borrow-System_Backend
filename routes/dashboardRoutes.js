import express from 'express';
import dashboardController from '../controllers/dashboardController.js';

const router = express.Router();
router.get('/summary', dashboardController.getAdminSummary); // <--- เพิ่ม summary endpoint
router.get('/monthly-borrow', dashboardController.getMonthlyBorrow);
router.get('/return-status', dashboardController.getReturnStatus);
router.get('/top-borrowed-equipment', dashboardController.getTopBorrowedEquipment);
router.get('/fine-summary', dashboardController.getFineSummary);
router.get('/repair-status', dashboardController.getRepairStatus);
router.get('/weekly-borrow-trend', dashboardController.getWeeklyBorrowTrend);
router.get('/borrow-forecast', dashboardController.getBorrowForecast);
router.get('/top-damaged-equipment', dashboardController.getTopDamagedEquipment);
router.get('/top-risk-users', dashboardController.getTopRiskUsers);
router.get('/total-equipment-value', dashboardController.getTotalEquipmentValue);
router.get('/total-damaged-value', dashboardController.getTotalDamagedValue);
router.get('/total-repair-cost', dashboardController.getTotalRepairCost);
router.get('/depreciation', dashboardController.getDepreciation);
router.get('/repair-vs-borrow-ratio', dashboardController.getRepairVsBorrowRatio);
router.get('/top-fine-categories', dashboardController.getTopFineCategories);
router.get('/frequent-damage-users', dashboardController.getFrequentDamageUsers);
router.get('/branch-borrow-summary', dashboardController.getBranchBorrowSummary);

export default router;
