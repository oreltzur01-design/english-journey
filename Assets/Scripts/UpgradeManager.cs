using System;
using System.Collections.Generic;
using UnityEngine;

public class UpgradeManager : MonoBehaviour
{
    public static UpgradeManager Instance { get; private set; }

    // Tracks the current level of each upgrade by its name.
    private Dictionary<string, int> upgradeLevels = new Dictionary<string, int>();

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

    public double CalculateCost(UpgradeItemData upgrade, int currentLevel)
    {
        return upgrade.BaseCost * Math.Pow(upgrade.CostMultiplier, currentLevel);
    }

    public bool BuyUpgrade(UpgradeItemData upgrade)
    {
        int currentLevel = GetLevel(upgrade);
        double cost = CalculateCost(upgrade, currentLevel);

        if (!GameManager.Instance.SpendMoney(cost))
            return false;

        upgradeLevels[upgrade.UpgradeName] = currentLevel + 1;
        GameManager.Instance.AddMoneyPerSecond(upgrade.IncomeBoost);
        return true;
    }

    public int GetLevel(UpgradeItemData upgrade)
    {
        upgradeLevels.TryGetValue(upgrade.UpgradeName, out int level);
        return level;
    }

    public void SetLevels(Dictionary<string, int> savedLevels)
    {
        upgradeLevels = new Dictionary<string, int>(savedLevels);
    }

    public Dictionary<string, int> GetAllLevels()
    {
        return new Dictionary<string, int>(upgradeLevels);
    }
}
