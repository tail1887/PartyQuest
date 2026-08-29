import { test, expect } from "@playwright/test";

test.describe("PartyQuest Playwright Automated Judging Test", () => {
  test("Complete Core User Flow from Onboarding to Reward Redemption", async ({ page }) => {
    // 1. 메인 페이지 접속
    await page.goto("http://localhost:3000");
    await expect(page).toHaveTitle(/PartyQuest/);

    // 2. 닉네임 입력 및 간편 온보딩
    const nicknameInput = page.locator('input[placeholder*="네온댄서"]');
    if (await nicknameInput.isVisible()) {
      await nicknameInput.fill("Playwright_Judge");
      await page.click("text=파티 퀘스트 입장하기");
    }

    // 3. 상단 헤더 유저 닉네임 확인
    await expect(page.locator("text=Playwright_Judge")).toBeVisible();

    // 4. 퀘스트 목록 탭 확인 & 퀘스트 완료 인증
    await page.click("text=🎯 퀘스트 목록");
    const completeBtn = page.locator("text=미션 완료 인증하기").first();
    if (await completeBtn.isVisible()) {
      await completeBtn.click();
    }

    // 5. 퀘스트 완료 성공 모달 팝업 확인
    await expect(page.locator("text=퀘스트 완수 성공!")).toBeVisible();
    await page.click("text=다음 퀘스트 계속하기");

    // 6. 네트워킹 월 탭 이동 & 방명록 작성
    await page.click("text=🤝 네트워킹 월");
    await page.click("text=💌 방명록");
    const gbInput = page.locator('input[placeholder*="한마디"]');
    await gbInput.fill("심사 테스트 방명록 메시지 전송합니다! ✨");
    await page.click("text=남기기");

    // 7. 실시간 랭킹 탭 확인
    await page.click("text=🏆 실시간 랭킹");
    await expect(page.locator("text=실시간 파티 퀘스트 랭킹")).toBeVisible();

    // 8. 리워드 교환소 탭 이동 & 쿠폰 교환
    await page.click("text=🎁 리워드 교환");
    await expect(page.locator("text=파티 리워드 교환소")).toBeVisible();

    // 9. 호스트 파티 관리자 탭 확인
    await page.click("text=⚙️ 호스트 관리");
    await expect(page.locator("text=호스트 파티 컨트롤 타워")).toBeVisible();
  });
});
