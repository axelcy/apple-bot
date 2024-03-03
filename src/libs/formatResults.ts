// credits: https://github.com/notunderctrl

const pb = {
    le: '<:le:1213757551800225822>',
    me: '<:me:1213757555604586546>',
    re: '<:re:1213757558527893514>',
    lf: '<:lf:1213757553851367454>',
    mf: '<:mf:1213757557114544138>',
    rf: '<:rf:1213757560440492032>',
}

function formatResults(upvotes: string[] = [], downvotes: string[] = []) {
    const totalVotes = upvotes.length + downvotes.length
    const progressBarLength = 12; // default 14
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0
    var emptySquares = progressBarLength - filledSquares || 0

    if (!filledSquares && !emptySquares) emptySquares = progressBarLength

    const upPercentage = (upvotes.length / totalVotes) * 100 || 0
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0

    const progressBar = (
        (filledSquares ? pb.lf : pb.le) +
        (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
        (filledSquares === progressBarLength ? pb.rf : pb.re)
    )

    const results = []
    results.push(
        `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${downvotes.length
        } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar)

    return results.join('\n')
}

export default formatResults