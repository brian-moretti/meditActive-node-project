function paginations(params) {
  const page = params.page || 0;
  const maxData = 3;
  const offsetData = page <= 1 ? 0 : (page - 1) * maxData;
  return { maxData, offsetData };
}

module.exports = paginations;
