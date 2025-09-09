export interface Statistics {
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stdDev: number;
  count: number;
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
