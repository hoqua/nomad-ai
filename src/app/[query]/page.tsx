import { DestinationItem, SearchKeys } from "@/types";
import Image from "next/image";

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function RequestPage(props: {
  params: { query: string };
}) {
  const pathNameParams = new URLSearchParams(
    decodeURIComponent(props.params.query)
  );
  const { location, month, budget, activity } = Object.fromEntries(
    pathNameParams
  ) as Record<SearchKeys, string>;

  if (!location || !month) return <p>No data</p>;

  let textPrompt = `Make a list of top 5 places to travel as digital nomad from ${location} in ${month}`;
  if (activity) textPrompt += ` to do ${activity}`;
  if (budget) textPrompt += ` with budget of ${budget}$ per month`;
  textPrompt += " and explain why. In format Location - Description";

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: textPrompt }],
    temperature: 0,
    max_tokens: 2000,
  });

  console.log(response.data.choices[0].message.content)

  const [, ...entries] = JSON.stringify(
    response.data.choices[0].message.content
  ).split("\\n\\n");

  const destinations: DestinationItem[] = [];

  for (const entry of entries) {
    const [locationWithNumber, description] = entry.split(" - ");
    const [, location] = locationWithNumber.split(".");

    const image = await openai.createImage({
      prompt: "Best place in" + location,
      n: 1,
      size: "512x512",
    });

    destinations.push({ location, description, img: image.data.data[0].url });
  }

  return (
      <div className="flex flex-col gap-4">
      {destinations.map(({ location, description, img }) => (
        <div key={location} className="card lg:card-side bg-base-100 shadow-xl">

          <figure className="relative w-full min-w-[230px] max-w-[230px]">
            <Image src={img} alt={location} fill />
          </figure>

          <div className="card-body">
            <h2 className="card-title">{location}</h2>
            <p>{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
