function splitFileIntoParts(source, interval) {
  const len = source.length

  if (len < interval) {
    return [source]
  }
  // find the latest line break
  let start = 0, end = interval, result = []
  while (true) {
    if (start > len - 1) {
      break;
    }
    const { content, newEnd } = findClosestLineBreak(source, start, end)
    if (!content) {
      throw new Error('Error')
    }

    result.push(content);
    start = newEnd + 1;
    end = start + interval

    if (end > len - 1) {
      end = len;
    }
  }
  // const finalResult = result.join('')
  // console.log(JSON.stringify(source))
  // console.log(JSON.stringify(finalResult))
  // console.log(finalResult.length)
  return result
}

function findClosestLineBreak(source, start, end) {
  let cursor = end

  while (source[cursor] !== '\n') {
    cursor--
  }

  if (cursor <= start) {
    cursor = end
    while (source[cursor] !== '\n') {
      cursor++
    }
  }

  // console.log(`${start}-${cursor}`)

  return {
    newEnd: cursor,
    content: source.slice(start, cursor + 1)
  }
}

module.exports = {
  splitFileIntoParts
}

// const source =
//   `# A
//
// asdasd asdsadd
//
// ## B
//
// sadasdasas
//
// ## C
//
// sadasdasas
// `
//
// console.log(splitFileIntoParts(source, 10))
