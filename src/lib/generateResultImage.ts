import type { ResultType, CategoryScores } from "@/types";
import { getTopCategories } from "@/lib/scoring";

const WIDTH = 360;
const PADDING = 28;

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    return;
  }

  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  const chars = [...text];
  let line = "";
  let y = startY;

  for (const char of chars) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = char;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

export async function generateResultImage(
  result: ResultType,
  scores: CategoryScores
): Promise<Blob> {
  const topCategories = getTopCategories(scores);
  const maxTextWidth = WIDTH - PADDING * 2;

  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  if (!measureCtx) throw new Error("Canvas를 사용할 수 없습니다.");

  measureCtx.font = "15px sans-serif";
  const summaryLines = Math.max(
    1,
    Math.ceil(measureCtx.measureText(result.summary).width / maxTextWidth)
  );
  const height =
    320 +
    summaryLines * 22 +
    topCategories.length * 28 +
    result.directions.length * 8;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * 2;
  canvas.height = height * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas를 사용할 수 없습니다.");

  ctx.scale(2, 2);

  ctx.fillStyle = result.color;
  ctx.fillRect(0, 0, WIDTH, height);

  let y = PADDING + 16;

  ctx.fillStyle = "#8B6F5E";
  ctx.font = "13px sans-serif";
  ctx.fillText("나 뭐하지? 진로 탐색 결과", PADDING, y);
  y += 28;

  ctx.fillStyle = result.accent;
  ctx.font = "bold 22px sans-serif";
  ctx.fillText(result.name, PADDING, y);
  y += 32;

  ctx.fillStyle = "#5C4033";
  ctx.font = "15px sans-serif";
  y = wrapText(ctx, result.summary, PADDING, y, maxTextWidth, 22);

  for (const cat of topCategories) {
    ctx.fillStyle = "#8B6F5E";
    ctx.font = "12px sans-serif";
    ctx.fillText(cat.label, PADDING, y);

    const barX = PADDING + 72;
    const barW = WIDTH - PADDING - barX;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    fillRoundRect(ctx, barX, y - 10, barW, 8, 4);

    ctx.fillStyle = result.accent;
    fillRoundRect(ctx, barX, y - 10, barW * ((cat.score - 4) / 16), 8, 4);
    y += 28;
  }

  y += 8;
  ctx.fillStyle = "#5C4033";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("추천 방향", PADDING, y);
  y += 22;

  let tagX = PADDING;
  ctx.font = "12px sans-serif";
  for (const dir of result.directions) {
    const tw = ctx.measureText(dir).width + 20;
    if (tagX + tw > WIDTH - PADDING) {
      tagX = PADDING;
      y += 30;
    }
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    fillRoundRect(ctx, tagX, y - 14, tw, 24, 12);
    ctx.fillStyle = "#5C4033";
    ctx.fillText(dir, tagX + 10, y + 2);
    tagX += tw + 8;
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("이미지 생성 실패"))),
      "image/png",
      1
    );
  });
}
