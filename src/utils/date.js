export function timeAgo(iso) {
  const d = new Date(iso);

  const diff = (Date.now() - d.getTime()) / 1000;

  if (diff < 60) {
    return "방금 전";
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}분 전`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}시간 전`;
  }

  if (diff < 86400 * 7) {
    return `${Math.floor(diff / 86400)}일 전`;
  }

  return d.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
}
