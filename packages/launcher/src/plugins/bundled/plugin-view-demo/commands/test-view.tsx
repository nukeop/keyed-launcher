import { Detail } from '@keyed-launcher/plugin-sdk';

const TestView = () => {
  return (
    <Detail
      markdown={`# Header 1\n\n## Test View\n\nThis is a test displaying markdown rendering.\n\n\`This is what code looks like\`\n\n\`\`\`typescript\n\nconst x = 2+2;\n\nfunction test(){}\n\n\`\`\`\n\n**Hello** _World_!\n\n![](https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png)`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Height" text={`1' 04"`} />
          <Detail.Metadata.Label title="Weight" text="13.2 lbs" />
          <Detail.Metadata.TagList title="Type">
            <Detail.Metadata.TagList.Item text="Electric" color="yellow-500" />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link
            title="Evolution"
            target="https://www.pokemon.com/us/pokedex/pikachu"
            text="Raichu"
          />
        </Detail.Metadata>
      }
    />
  );
};

export default TestView;
