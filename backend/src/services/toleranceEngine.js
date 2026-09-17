/**
 * Legal Metrology Maximum Permissible Error (MPE) Engine
 * Reference: Legal Metrology (General) Rules, Schedule VII, Part II (Verification)
 */

export function calculateMPE(loadKg, leastCountKg = 0.005) {
  const e = Number(leastCountKg);
  const n = loadKg / e; // Number of verification scale intervals

  if (n <= 500) {
    return 1.0 * e;
  } else if (n <= 2000) {
    return 2.0 * e;
  } else {
    return 3.0 * e;
  }
}

export function evaluateReading({ testWeightKg, indicatedWeightKg, loadKg, readingKg, leastCountKg = 0.005 }) {
  const load = Number(testWeightKg !== undefined ? testWeightKg : loadKg);
  const indicated = Number(indicatedWeightKg !== undefined ? indicatedWeightKg : readingKg);
  const e = Number(leastCountKg) || 0.005;
  
  const rawError = indicated - load;
  const mpe = calculateMPE(load, e);
  const absError = Math.abs(rawError);
  const pass = absError <= (mpe + 0.000001); // floating point tolerance

  return {
    testWeightKg: load,
    indicatedWeightKg: indicated,
    errorKg: Number(rawError.toFixed(5)),
    mpeKg: Number(mpe.toFixed(5)),
    errorInScaleIntervals: Number((rawError / e).toFixed(2)),
    pass,
    toleranceMarginPercent: Number(((absError / mpe) * 100).toFixed(1))
  };
}

export function evaluateAllReadings(readings = [], leastCountKg = 0.005) {
  if (!Array.isArray(readings) || readings.length === 0) {
    return {
      allPassed: false,
      evaluatedReadings: [],
      summary: 'No readings provided'
    };
  }

  const evaluated = readings.map(r => evaluateReading({
    testWeightKg: r.testWeightKg !== undefined ? r.testWeightKg : r.loadKg,
    indicatedWeightKg: r.indicatedWeightKg !== undefined ? r.indicatedWeightKg : r.readingKg,
    leastCountKg
  }));

  const allPassed = evaluated.every(r => r.pass);
  const maxDeviation = Math.max(...evaluated.map(r => Math.abs(r.errorKg)));

  return {
    allPassed,
    evaluatedReadings: evaluated,
    maxDeviationKg: Number(maxDeviation.toFixed(5)),
    summary: allPassed 
      ? `All ${evaluated.length} test loads within Legal Metrology MPE tolerance.`
      : `Calibration Failed: 1 or more test loads exceed Maximum Permissible Error.`
  };
}
