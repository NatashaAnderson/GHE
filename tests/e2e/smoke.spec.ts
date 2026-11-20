import { expect, test } from '@playwright/test'

test('loads campus hub and can open module 1 via deep link', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('app-shell')).toBeVisible()
  await expect(page.getByTestId('hud')).toContainText('Green Hydrogen Energy')
  await expect(page.getByTestId('enter-vr')).toBeVisible()

  await page.goto('/?module=m01&embed=1')
  await expect(page.getByTestId('hud')).toContainText('Hydrogen Explorer')
  await expect(page.getByTestId('station-progress')).toBeVisible()
  await expect(page.getByTestId('coach-banner')).toBeVisible()
  await expect(page.getByText('LMS embed')).toBeVisible()
})

test('quiz overlay awards badge after correct answers', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'ghe-progress-v1',
      JSON.stringify({
        state: {
          completedStations: {
            m01: [
              'meet-hydrogen',
              'bonding-lab',
              'green-electrolyzer',
              'energy-carrier',
            ],
          },
          stationFlags: {},
          quizScores: {},
          earnedBadges: [],
          reduceMotion: true,
        },
        version: 0,
      }),
    )
  })

  await page.goto('/?module=m01')
  await expect(page.getByTestId('station-progress')).toContainText('Stations 4/4')
  await page.getByRole('button', { name: 'Knowledge Check' }).click()
  await expect(page.getByTestId('quiz-overlay')).toBeVisible()

  await page.evaluate(() => {
    const correct: Record<string, string> = {
      q1: 'b',
      q2: 'd',
      q3: 'a',
      q4: 'c',
      q5: 'b',
      q6: 'd',
    }
    Object.entries(correct).forEach(([questionId, choiceId]) => {
      const input = document.querySelector(
        `input[name="${questionId}"][value="${choiceId}"]`,
      ) as HTMLInputElement | null
      input?.click()
    })
  })

  await page.getByTestId('submit-quiz').click()
  await page.getByTestId('claim-badge').click()
  await expect(page.getByTestId('badge-overlay')).toBeVisible()
  await expect(page.getByTestId('badge-overlay').getByText('HYDROGEN EXPLORER')).toBeVisible()
})
