#!/usr/bin/env bash
# ==============================================================================
# Ralph Loop Runner for PartyQuest
# Reference: GDGCampusKorea/antigravity-ralph-loop-test
# ==============================================================================

set -uo pipefail

RALPH_MODEL="${RALPH_MODEL:-Gemini 3.1 Pro (High)}"
RALPH_MAX_ITERS="${RALPH_MAX_ITERS:-15}"
RALPH_MAX_STALLS="${RALPH_MAX_STALLS:-2}"

PROMPT='
너는 PartyQuest 프로젝트를 자율 개발하는 코딩 에이전트야.

1. PRD.md 를 읽고 아직 [ ] 로 남아있는 가장 첫 번째 미완료 Task 딱 1개만 찾아라.
2. progress.txt 를 읽어 이전 작업 내역과 주의사항을 파악해라.
3. 해당 Task를 완벽하게 구현하고 검증(빌드/테스트)해라.
4. 구현이 완료되면 PRD.md의 해당 Task를 [x] 로 체크해라.
5. progress.txt 에 작업 완료 로그(구현 내용, 변경 파일, 테스트 결과)를 반드시 append(추가)해라. 절대 기존 내용을 지우지 마라.
6. 만약 모든 Task가 [x] 처리되었다면 progress.txt의 마지막 줄에 "ALL TASKS COMPLETE" 를 적어라.
7. 변경 사항을 git commit 해라.

⚠️ 주의: 한 번에 오직 1개의 Task만 수행해라.
'

echo "=================================================="
echo "🚀 Starting Ralph Loop for PartyQuest"
echo "Model: ${RALPH_MODEL}"
echo "Max Iterations: ${RALPH_MAX_ITERS}"
echo "Max Stalls: ${RALPH_MAX_STALLS}"
echo "=================================================="

count_completed_tasks() {
  if [[ -f "PRD.md" ]]; then
    grep -c '^\- \[x\]' "PRD.md" 2>/dev/null || echo 0
  else
    echo 0
  fi
}

iter=0
stalls=0

while [[ $iter -lt $RALPH_MAX_ITERS ]]; do
  ((iter++))
  echo ""
  echo "--- [Iteration $iter / $RALPH_MAX_ITERS] ---"

  if grep -q "ALL TASKS COMPLETE" progress.txt 2>/dev/null; then
    echo "🎉 ALL TASKS COMPLETE found in progress.txt! Finished successfully."
    exit 0
  fi

  tasks_before=$(count_completed_tasks)

  if command -v agy &>/dev/null; then
    agy -p "$PROMPT" --model "$RALPH_MODEL" || true
  else
    echo "ℹ️ agy CLI not in PATH. Please run tasks in Antigravity or provide agent runner."
    exit 1
  fi

  tasks_after=$(count_completed_tasks)

  if [[ $tasks_after -le $tasks_before ]]; then
    ((stalls++))
    echo "⚠️ Stall detected ($stalls / $RALPH_MAX_STALLS): No new task completed in this iteration."
    if [[ $stalls -ge $RALPH_MAX_STALLS ]]; then
      echo "❌ Max stalls reached. Halting loop to prevent token waste."
      exit 1
    fi
  else
    stalls=0
    echo "✅ Progress made! Tasks completed: $tasks_before -> $tasks_after"
  fi

  sleep 2
done

echo "⚠️ Reached maximum iterations ($RALPH_MAX_ITERS)."
exit 1
