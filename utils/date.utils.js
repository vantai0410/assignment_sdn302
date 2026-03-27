/**
 * Tính số ngày thuê (làm tròn lên)
 * @param {Date} start
 * @param {Date} end
 * @returns {number}
 */
function calculateRentalDays(start, end) {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    throw new Error("Invalid date format");
  }
  // comment
  const  diffMs = Math.abs(end - start);
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays || 1; // ít nhất 1 ngày
}

module.exports = { calculateRentalDays };
