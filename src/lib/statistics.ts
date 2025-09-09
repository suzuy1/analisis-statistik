export interface Statistics {
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stdDev: number;
  count: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
}

const cleanData = (data: number[]): number[] => {
  return data.filter(n => typeof n === 'number' && isFinite(n));
};

export const calculateMean = (data: number[]): number => {
  const nums = cleanData(data);
  if (nums.length === 0) return 0;
  const sum = nums.reduce((acc, val) => acc + val, 0);
  return sum / nums.length;
};

export const calculateMedian = (data: number[]): number => {
  const nums = cleanData(data);
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const calculateMode = (data: number[]): number[] => {
  const nums = cleanData(data);
  if (nums.length === 0) return [];
  const frequency: { [key: number]: number } = {};
  nums.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
  });

  let maxFreq = 0;
  Object.values(frequency).forEach(freq => {
    if (freq > maxFreq) {
      maxFreq = freq;
    }
  });

  if (maxFreq <= 1 && new Set(nums).size > 1) return []; // No mode if all elements appear once or less

  const modes: number[] = [];
  Object.keys(frequency).forEach(numStr => {
    const num = Number(numStr);
    if (frequency[num] === maxFreq) {
      modes.push(num);
    }
  });
  
  if (modes.length === new Set(nums).size && modes.length > 1) {
    return []; // No mode if all unique elements have the same frequency
  }

  return modes;
};

export const calculateVariance = (data: number[]): number => {
  const nums = cleanData(data);
  if (nums.length < 2) return 0;
  const mean = calculateMean(nums);
  const squaredDifferences = nums.map(val => (val - mean) ** 2);
  const sumOfSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
  return sumOfSquaredDiff / (nums.length - 1); // Sample variance
};

export const calculateStdDev = (data: number[]): number => {
  const nums = cleanData(data);
  if (nums.length < 2) return 0;
  return Math.sqrt(calculateVariance(nums));
};

const quantile = (sortedData: number[], q: number): number => {
  const pos = (sortedData.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sortedData[base + 1] !== undefined) {
    return sortedData[base] + rest * (sortedData[base + 1] - sortedData[base]);
  } else {
    return sortedData[base];
  }
};

export const calculateQuartiles = (data: number[]): { q1: number, q3: number } => {
  const nums = cleanData(data);
  if (nums.length < 2) return { q1: 0, q3: 0 };
  const sorted = [...nums].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  return { q1, q3 };
};

export const calculateRange = (data: number[]): number => {
    const nums = cleanData(data);
    if (nums.length === 0) return 0;
    return Math.max(...nums) - Math.min(...nums);
};

export const calculateIQR = (data: number[]): number => {
    const { q1, q3 } = calculateQuartiles(data);
    return q3 - q1;
};
