import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RecordMetadataValue } from "@pinecone-database/pinecone";

export function PillTooltip({
  similarity,
  photo_description,
  photo_image_url,
  ai_description,
}: {
  similarity?: number;
  photo_description?: RecordMetadataValue;
  photo_image_url?: RecordMetadataValue;
  ai_description?: RecordMetadataValue;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-black bg-opacity-50 text-white text-xs px-3 py-1 w-fit rounded-full hover:cursor-pointer">
            <span className="block truncate">{similarity ?? "N/A"}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px]">
          <ul className="text-sm space-y-1">
            <li>
              <strong>Description:</strong> {photo_description || "N/A"}
            </li>
            <li>
              <strong>Image URL:</strong> {photo_image_url || "N/A"}
            </li>
            <li>
              <strong>AI Description:</strong> {ai_description || "N/A"}
            </li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
