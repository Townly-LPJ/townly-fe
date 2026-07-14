const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

/**
 * 지역 정보 챗봇 API를 호출합니다.
 *
 * @param {string} message 현재 사용자 메시지
 * @param {{ role: 'user' | 'assistant', content: string }[]} history 이전 대화
 * @returns {Promise<{ answer: string, places: Array }>}
 */
export async function sendChatMessage(message, history = []) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history,
    }),
  })

  if (!response.ok) {
    let errorMessage = '챗봇 요청 중 오류가 발생했습니다.'

    try {
      const errorData = await response.json()

      if (errorData.detail) {
        errorMessage = errorData.detail
      }
    } catch {
      // JSON 오류 응답이 아니면 기본 메시지를 사용합니다.
    }

    throw new Error(errorMessage)
  }

  return response.json()
}