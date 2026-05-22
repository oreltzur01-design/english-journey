using UnityEngine;

[CreateAssetMenu(fileName = "NewUpgrade", menuName = "IdleClicker/Upgrade Item")]
public class UpgradeItemData : ScriptableObject
{
    public string UpgradeName;
    public double BaseCost;
    public double CostMultiplier = 1.15;
    public double IncomeBoost;
}
