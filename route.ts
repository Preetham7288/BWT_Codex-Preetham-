export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    let summary = "AI Summary:\n";

    if (code.includes("login")) {
      summary +=
        "You are implementing a login authentication function. Next step: add password hashing and database validation.";
    } else if (code.includes("fetch")) {
      summary +=
        "You are fetching data from an API. Next step: add error handling and loading states.";
    } else if (code.includes("sort")) {
      summary +=
        "You are implementing a sorting algorithm. Next step: optimize the algorithm or test with larger arrays.";
    } else {
      summary +=
        "You are writing application logic. Next step: continue building the feature and add proper validation.";
    }

    return Response.json({
      summary: summary,
    });
  } catch (error) {
    return Response.json({
      summary: "AI could not analyze the code.",
    });
  }
}