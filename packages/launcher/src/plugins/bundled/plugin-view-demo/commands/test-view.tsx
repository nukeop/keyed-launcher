import { Detail } from '@keyed-launcher/plugin-sdk';

const TestView = () => {
  return (
    <Detail markdown="# Header 1\n\n## Test View\n\nThis is a test view for the Keyed Launcher.">
      <Detail.Metadata>
        <Detail.Metadata.Label
          title="Height"
          text={`1' 04"`}
          icon="weight.svg"
        />
      </Detail.Metadata>
    </Detail>
  );
};

export default TestView;
