const Pharmacy = require('../models/Pharmacy');
const AppError = require('../utils/AppError');

class PharmacyService {
  async getMedicines(query = {}) {
    const filter = {};
    if (query.village) filter.village = query.village;
    
    const pharmacies = await Pharmacy.find(filter);
    let allMedicines = [];
    pharmacies.forEach(p => {
      allMedicines = [...allMedicines, ...p.medicines.map(m => ({ ...m.toObject(), pharmacyName: p.name, village: p.village }))];
    });

    if (query.search) {
      const regex = new RegExp(query.search, 'i');
      allMedicines = allMedicines.filter(m => regex.test(m.name));
    }

    return allMedicines;
  }

  async updateStock(pharmacyId, medicineName, stock) {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) throw new AppError('Pharmacy not found', 404);
    
    const medicine = pharmacy.medicines.find(m => m.name === medicineName);
    if (!medicine) throw new AppError('Medicine not found in this pharmacy', 404);
    
    medicine.stock = stock;
    medicine.isAvailable = stock > 0;
    
    await pharmacy.save();
    return medicine;
  }

  async addMedicine(pharmacyId, data) {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) throw new AppError('Pharmacy not found', 404);
    
    pharmacy.medicines.push(data);
    await pharmacy.save();
    return pharmacy;
  }
}

module.exports = new PharmacyService();
