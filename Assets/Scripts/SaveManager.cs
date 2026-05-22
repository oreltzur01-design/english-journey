using System;
using System.Collections.Generic;
using UnityEngine;

public class SaveManager : MonoBehaviour
{
    public static SaveManager Instance { get; private set; }

    public event Action<double> OnOfflineEarningsCalculated;

    private const string KeyMoney = "CurrentMoney";
    private const string KeyMPS = "MoneyPerSecond";
    private const string KeyQuitTime = "QuitTime";
    private const string KeyUpgradeLevels = "UpgradeLevels";

    [Serializable]
    private class SaveData
    {
        public double currentMoney;
        public double moneyPerSecond;
        public List<UpgradeLevelEntry> upgradeLevels = new List<UpgradeLevelEntry>();
    }

    [Serializable]
    private class UpgradeLevelEntry
    {
        public string upgradeName;
        public int level;
    }

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    private void Start()
    {
        LoadGame();
    }

    private void OnApplicationQuit()
    {
        SaveGame();
    }

    private void OnApplicationPause(bool paused)
    {
        if (paused) SaveGame();
    }

    public void SaveGame()
    {
        var data = new SaveData
        {
            currentMoney = GameManager.Instance.CurrentMoney,
            moneyPerSecond = GameManager.Instance.MoneyPerSecond
        };

        foreach (var kvp in UpgradeManager.Instance.GetAllLevels())
        {
            data.upgradeLevels.Add(new UpgradeLevelEntry
            {
                upgradeName = kvp.Key,
                level = kvp.Value
            });
        }

        PlayerPrefs.SetString(KeyMoney, data.currentMoney.ToString("R"));
        PlayerPrefs.SetString(KeyMPS, data.moneyPerSecond.ToString("R"));
        PlayerPrefs.SetString(KeyUpgradeLevels, JsonUtility.ToJson(data));
        PlayerPrefs.SetString(KeyQuitTime, DateTime.UtcNow.ToString("O"));
        PlayerPrefs.Save();
    }

    public void LoadGame()
    {
        if (!PlayerPrefs.HasKey(KeyMoney))
            return;

        double money = double.Parse(PlayerPrefs.GetString(KeyMoney, "0"));
        double mps = double.Parse(PlayerPrefs.GetString(KeyMPS, "0"));

        // Restore upgrade levels.
        string json = PlayerPrefs.GetString(KeyUpgradeLevels, "{}");
        SaveData data = JsonUtility.FromJson<SaveData>(json) ?? new SaveData();

        var levelDict = new Dictionary<string, int>();
        foreach (var entry in data.upgradeLevels)
            levelDict[entry.upgradeName] = entry.level;

        UpgradeManager.Instance.SetLevels(levelDict);

        // Calculate offline earnings.
        double offlineEarnings = 0;
        string quitTimeStr = PlayerPrefs.GetString(KeyQuitTime, string.Empty);
        if (!string.IsNullOrEmpty(quitTimeStr) &&
            DateTime.TryParse(quitTimeStr, null, System.Globalization.DateTimeStyles.RoundtripKind, out DateTime quitTime))
        {
            double secondsAway = (DateTime.UtcNow - quitTime).TotalSeconds;
            if (secondsAway > 0 && mps > 0)
                offlineEarnings = secondsAway * mps;
        }

        GameManager.Instance.SetMoney(money + offlineEarnings, mps);

        if (offlineEarnings > 0)
            OnOfflineEarningsCalculated?.Invoke(offlineEarnings);
    }
}
