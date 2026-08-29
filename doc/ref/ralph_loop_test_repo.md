# Antigravity Ralph Loop 테스트 레포지토리 정리

- **저장소 URL**: [https://github.com/GDGCampusKorea/antigravity-ralph-loop-test](https://github.com/GDGCampusKorea/antigravity-ralph-loop-test)
- **단축 URL**: `https://m.site.naver.com/2eyWZ`
- **관련 발표자료**: [IOEX26 — Antigravity 101](https://docs.google.com/presentation/d/1mfLX8bbLfpB4Kuxcj_AtX2NJdvhhOQIxpu8A4rv_A6U/edit?usp=sharing)
- **개발자**: [@Daehyun-Bigbread](https://github.com/Daehyun-Bigbread)

---

## 1. Ralph Loop 핵심 메커니즘

LLM의 컨텍스트 한계(Context Limit)와 지속 감독 필요성을 해결하는 파일 기반 자율 코딩 루프:

```text
1. PRD.md 에서 태스크 읽기
2. progress.txt 로 진행 상황 확인
3. 딱 1개 태스크만 구현 및 완료
4. progress.txt 에 결과 append (기존 기록 삭제 금지)
5. git commit
6. 모든 태스크 완료 또는 Max Iteration 도달 시까지 루프 반복
```

> **핵심**: 매 반복(Iteration)마다 **죽었다 새로 뜨는 새 세션(Fresh Context)**으로 실행하여 컨텍스트 오염을 방지하고, 장기 기억은 `PRD.md` + `progress.txt` + `Git Log`에 유지.

---

## 2. 레포지토리 파일 구성

| 파일 | 역할 |
|---|---|
| `PRD.md` | **단일 진실 공급원(Single Source of Truth)**. 태스크 목록 + 에이전트 운영 규칙 + 디자인 요구사항 |
| `progress.txt` | **Append-only 진행 로그**. 태스크 완료 시마다 한 줄씩 추가, 완료 시 `ALL TASKS COMPLETE` 기록 |
| `ralph.sh` | **루프 러너 스크립트**. `agy -p`를 매 반복 새 세션으로 호출, 실패/정체(stall) 감지 및 백오프 |
| `TEST_PLAN.md` | 모델별(Claude Sonnet 4.6, Gemini 3.1 Pro 등) 비교 평가 기준 및 브랜치 전략 |

---

## 3. `ralph.sh` 러너 안전장치

1. **실패 감지**: `agy` 종료 코드 확인 (크래시, 타임아웃, 레이트 리밋 발생 시 무진전 분류)
2. **정체(Stall) 감지**: `PRD.md` 내 `[x]` 체크 개수를 비교하여 실질적 진전이 없을 때 정체 카운트 증가
3. **연속 정체 시 자동 중단**: `RALPH_MAX_STALLS`(기본 2회) 연속 실패 시 루프를 멈추어 무한 토큰 낭비 방지
4. **실패 시 백오프**: 에러 발생 시 대기 시간을 늘려 API 레이트 리밋 회복 유도

---

## 4. 실행 환경 변수 설정

```bash
# 기본 실행 (Gemini 3.1 Pro)
bash ralph.sh

# 모델 변경 및 파라미터 조정
RALPH_MODEL="Claude Sonnet 4.6 (Thinking)" RALPH_MAX_ITERS=20 bash ralph.sh
```

- `RALPH_MODEL`: 사용할 LLM 모델명
- `RALPH_MAX_ITERS`: 최대 반복 횟수 (기본값: 15)
- `RALPH_MAX_STALLS`: 연속 무진전 허용 횟수 (기본값: 2)
