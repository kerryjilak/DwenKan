/**
 * Feedforward Neural Network forward pass (client-side, pure JS).
 *
 * Replaces PyTorch backend with simple matrix operations.
 * Uses a seeded PRNG for reproducible Xavier-uniform weight initialization.
 */

// Simple seeded PRNG (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ACTIVATIONS = {
  relu: (x) => Math.max(0, x),
  sigmoid: (x) => 1 / (1 + Math.exp(-x)),
  tanh: (x) => Math.tanh(x),
};

/**
 * Xavier-uniform initialization: U(-limit, limit) where limit = sqrt(6 / (fan_in + fan_out))
 */
function xavierMatrix(rows, cols, rng) {
  const limit = Math.sqrt(6 / (rows + cols));
  const mat = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(rng() * 2 * limit - limit);
    }
    mat.push(row);
  }
  return mat;
}

/**
 * Matrix-vector multiply: result[i] = sum_j(W[i][j] * x[j]) + bias[i]
 */
function linearForward(W, bias, input) {
  const outSize = W.length;
  const result = [];
  for (let i = 0; i < outSize; i++) {
    let sum = bias[i];
    for (let j = 0; j < input.length; j++) {
      sum += W[i][j] * input[j];
    }
    result.push(sum);
  }
  return result;
}

/**
 * Batched forward pass: process each sample independently.
 */
export function runForwardPass({ config, input_data }) {
  const {
    input_size = 2,
    hidden_sizes = [4, 4],
    output_size = 1,
    activation = 'relu',
  } = config;

  const actFn = ACTIVATIONS[activation] || ACTIVATIONS.relu;
  const rng = mulberry32(42);

  // Build layers: list of { W, bias, isOutput }
  const layers = [];
  let prevSize = input_size;
  for (const hs of hidden_sizes) {
    layers.push({
      W: xavierMatrix(hs, prevSize, rng),
      bias: new Array(hs).fill(0),
      isOutput: false,
    });
    prevSize = hs;
  }
  layers.push({
    W: xavierMatrix(output_size, prevSize, rng),
    bias: new Array(output_size).fill(0),
    isOutput: true,
  });

  // Process each sample in the batch
  const batchOutput = [];
  const layerActivations = [{ layer_name: 'Input', values: input_data }];
  // We'll accumulate per-layer values across the batch
  const layerBatchValues = layers.map(() => []);

  const architecture = [`Input: ${input_size} features`];

  for (const sample of input_data) {
    let x = sample;
    for (let li = 0; li < layers.length; li++) {
      const { W, bias, isOutput } = layers[li];
      x = linearForward(W, bias, x);
      if (!isOutput) {
        x = x.map(actFn);
      }
      layerBatchValues[li].push(x);
    }
    batchOutput.push(x);
  }

  // Build layer activations and architecture descriptions
  let hiddenIdx = 0;
  for (let li = 0; li < layers.length; li++) {
    const { W, isOutput } = layers[li];
    const inFeatures = W[0].length;
    const outFeatures = W.length;
    if (isOutput) {
      layerActivations.push({
        layer_name: 'Output',
        values: layerBatchValues[li],
      });
      architecture.push(`Output: Linear(${inFeatures} → ${outFeatures})`);
    } else {
      hiddenIdx++;
      layerActivations.push({
        layer_name: `Hidden ${hiddenIdx}`,
        values: layerBatchValues[li],
      });
      architecture.push(
        `Hidden ${hiddenIdx}: Linear(${inFeatures} → ${outFeatures}) + ${activation}`
      );
    }
  }

  return {
    output: batchOutput,
    layer_activations: layerActivations,
    architecture,
  };
}
