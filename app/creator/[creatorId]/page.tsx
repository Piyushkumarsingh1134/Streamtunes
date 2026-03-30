import Streamview from "@/app/components/Streamview";

export default function ({
  params: {
    creatorId
  }
}: {
  params: {
    creatorId: string;
  };
}) {
  return <div>
    <Streamview creatorId={creatorId} playVideo={true}/>
        </div>;
}