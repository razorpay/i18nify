const fs = require('fs');

function safeChunkSize(size) {
  const isNumber = (v) => typeof v === 'number';
  const inKb = (v) => v / 1024;

  return isNumber(size) ? inKb(size) : 0;
}

function round(v) {
  return Math.round(v * 1e2) / 1e2;
}

function extractStatsForChunk(chunkName, baseStats, prStats) {
  //parsed size
  const baseParseSize = round(
    safeChunkSize(baseStats[chunkName] && baseStats[chunkName].parsed),
  );
  const prParseSize = round(
    safeChunkSize(prStats[chunkName] && prStats[chunkName].parsed),
  );

  //gzipped
  const baseGzipSize = round(
    safeChunkSize(baseStats[chunkName] && baseStats[chunkName].gzip),
  );
  const prGzipSize = round(
    safeChunkSize(prStats[chunkName] && prStats[chunkName].gzip),
  );

  return {
    baseSize: { parsed: baseParseSize, gzip: baseGzipSize },
    prSize: { parsed: prParseSize },
    difference: {
      parsed: round(prParseSize - baseParseSize),
      gzip: round(prGzipSize - baseGzipSize),
    },
    differencePercent: {
      parsed: round(((prParseSize - baseParseSize) * 100) / baseParseSize),
      gzip: round(((prGzipSize - baseGzipSize) * 100) / baseGzipSize),
    },
  };
}

/**
 * output
 * {
 *   abc.js: { base, pr, diff, diff% },
 * }
 */
function calculateDifferences(baseStats, prStats) {
  const initialChunks = Array.from(
    new Set([...Object.keys(baseStats).concat(Object.keys(prStats))]),
  ).sort();

  const report = Object.fromEntries(
    initialChunks.map((chunkName) => [
      chunkName,
      extractStatsForChunk(chunkName, baseStats, prStats),
    ]),
  );

  return report;
}

function differenceToSymbol(v) {
  // new chunk found
  if (v === Infinity) {
    return '🆕';
  }

  // chunk deleted
  if (v === -100) {
    return '🗑';
  }

  // pr chunk size increased
  if (v > 0) {
    return '📈';
  }

  // pr chunk size reduced
  if (v < 0) {
    return '👍';
  }

  return '🟢';
}

function traverseFileAndGenerateStats(dir) {
  const filesToTrack = ['esm/index.js', 'cjs/index.js', 'umd/index.js'];

  return filesToTrack.reduce((acc, curr) => {
    const fullPath = `${dir}/${curr}`;
    acc[curr] = {
      parsed: fs.lstatSync(fullPath).size,
      gzip: fs.existsSync(fullPath + '.gz')
        ? fs.lstatSync(fullPath + '.gz').size
        : 0,
    };
    return acc;
  }, {});
}

function formatToTable(stat, statName) {
  return [
    `<details open>`,
    `<summary><h3>${statName}</h3> <em>click to expand/collapse</em></summary>`,
    '',
    '| 🟢 No Change | 🗑 File Deleted | 🆕 New File | 📈 Size Increased | 👍 Size Reduced |',
    '| --- | --- | --- | --- | --- |',
    '',
    '<table>',
    '<tbody>',
    '<tr> <td></td> <td></td> <th colspan="4">Gzip (kb)</th> <th colspan="4">Parsed (kb)</th> </tr>',
    '<tr>' +
      ' <td>🚦</td>' +
      ' <th>File Name</th>' +
      ' <th>Base</th>' +
      ' <th>PR</th>' +
      ' <th>Diff</th>' +
      ' <th>%</th>' +
      ' <th>Base</th>' +
      ' <th>PR</th>' +
      ' <th>Diff</th>' +
      ' <th>%</th>' +
      '</tr>',
    ...Object.entries(stat).map(([filename, fileStat]) => {
      const diffColor = fileStat.difference.gzip <= 0 ? 'green' : 'red';
      return `<tr>
        <td>${differenceToSymbol(fileStat.differencePercent.gzip)}</td>
        <td><strong><code>${filename} </code></strong></td>
        <td><code>${fileStat.baseSize.gzip} </code></td>
        <td><code>${fileStat.prSize.gzip} </code></td>
        <td> $\\textcolor{${diffColor}}{${fileStat.difference.gzip}}$ </td>
        <td><code>${
          isFinite(fileStat.differencePercent.gzip)
            ? fileStat.differencePercent.gzip
            : '—'
        } </code></td>
        <td><code> ${fileStat.baseSize.parsed} </code></td>
        <td><code> ${fileStat.prSize.parsed} </code></td>
        <td> $\\textcolor{${diffColor}}{${fileStat.difference.parsed}}$ </td>
        <td><code> ${
          isFinite(fileStat.differencePercent.parsed)
            ? fileStat.differencePercent.parsed
            : '—'
        } </code></td>
      </tr>`;
    }),
    '</tbody>',
    '</table>',
    '</details/>',
  ].join('\n');
}

function generateTableReport() {
  const baseBuildPath = 'build/base';
  const prBuildPath = 'build/pr';

  const baseStats = traverseFileAndGenerateStats(baseBuildPath);
  const prStats = traverseFileAndGenerateStats(prBuildPath);

  const rawStats = calculateDifferences(baseStats, prStats);

  return [formatToTable(rawStats, 'Files')].join('\n');
}

module.exports.generateTableReport = generateTableReport;
