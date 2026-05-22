using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    [Header("HUD")]
    [SerializeField] private TextMeshProUGUI moneyText;
    [SerializeField] private TextMeshProUGUI moneyPerSecondText;

    [Header("Offline Popup")]
    [SerializeField] private GameObject offlinePopupPanel;
    [SerializeField] private TextMeshProUGUI offlineEarningsText;

    [Header("Floating Text")]
    [SerializeField] private GameObject floatingTextPrefab;
    [SerializeField] private Canvas uiCanvas;

    private void OnEnable()
    {
        GameManager.Instance.OnMoneyChanged += RefreshMoneyUI;
        SaveManager.Instance.OnOfflineEarningsCalculated += ShowOfflinePopup;
    }

    private void OnDisable()
    {
        if (GameManager.Instance != null)
            GameManager.Instance.OnMoneyChanged -= RefreshMoneyUI;
        if (SaveManager.Instance != null)
            SaveManager.Instance.OnOfflineEarningsCalculated -= ShowOfflinePopup;
    }

    private void Start()
    {
        RefreshMoneyUI();
    }

    private void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            GameManager.Instance.ClickAction();
            SpawnFloatingText(Input.mousePosition, GameManager.Instance.CurrentMoney);
        }
    }

    // ── UI Refresh ────────────────────────────────────────────────────────────

    private void RefreshMoneyUI()
    {
        if (moneyText != null)
            moneyText.text = "$" + FormatNumber(GameManager.Instance.CurrentMoney);
        if (moneyPerSecondText != null)
            moneyPerSecondText.text = "$" + FormatNumber(GameManager.Instance.MoneyPerSecond) + "/s";
    }

    // ── Offline Popup ─────────────────────────────────────────────────────────

    private void ShowOfflinePopup(double earnings)
    {
        if (offlinePopupPanel == null) return;
        offlinePopupPanel.SetActive(true);
        if (offlineEarningsText != null)
            offlineEarningsText.text = "Welcome back!\nYou earned $" + FormatNumber(earnings) + " while away.";
    }

    public void CloseOfflinePopup()
    {
        if (offlinePopupPanel != null)
            offlinePopupPanel.SetActive(false);
    }

    // ── Floating Text ─────────────────────────────────────────────────────────

    private void SpawnFloatingText(Vector3 screenPos, double clickValue)
    {
        if (floatingTextPrefab == null || uiCanvas == null) return;

        GameObject go = Instantiate(floatingTextPrefab, uiCanvas.transform);

        // Position it at the click location in canvas space.
        RectTransformUtility.ScreenPointToLocalPointInRectangle(
            uiCanvas.GetComponent<RectTransform>(),
            screenPos,
            uiCanvas.renderMode == RenderMode.ScreenSpaceOverlay ? null : Camera.main,
            out Vector2 localPos);

        go.GetComponent<RectTransform>().localPosition = localPos;

        TextMeshProUGUI label = go.GetComponentInChildren<TextMeshProUGUI>();
        if (label != null)
            label.text = "+$" + FormatNumber(1); // base click value display

        StartCoroutine(AnimateFloatingText(go));
    }

    private IEnumerator AnimateFloatingText(GameObject go)
    {
        RectTransform rt = go.GetComponent<RectTransform>();
        TextMeshProUGUI label = go.GetComponentInChildren<TextMeshProUGUI>();
        float duration = 1.0f;
        float elapsed = 0f;
        Vector3 startPos = rt.localPosition;
        Color startColor = label != null ? label.color : Color.white;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;

            rt.localPosition = startPos + Vector3.up * (80f * t);

            if (label != null)
                label.color = new Color(startColor.r, startColor.g, startColor.b, 1f - t);

            yield return null;
        }

        Destroy(go);
    }

    // ── Number Formatting ─────────────────────────────────────────────────────

    public static string FormatNumber(double value)
    {
        if (value >= 1_000_000_000_000.0) return (value / 1_000_000_000_000.0).ToString("F2") + "T";
        if (value >= 1_000_000_000.0)     return (value / 1_000_000_000.0).ToString("F2") + "B";
        if (value >= 1_000_000.0)         return (value / 1_000_000.0).ToString("F2") + "M";
        if (value >= 1_000.0)             return (value / 1_000.0).ToString("F2") + "K";
        return value.ToString("F0");
    }
}
