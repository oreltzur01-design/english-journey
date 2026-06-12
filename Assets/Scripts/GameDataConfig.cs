using System;
using UnityEngine;

[Serializable]
public class StageData
{
    public string StageName;
    public double RequiredFollowers;
    public double TransitionCost;
}

public class GameDataConfig : MonoBehaviour
{
    public static GameDataConfig Instance { get; private set; }

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

    public static readonly StageData[] Stages = new StageData[]
    {
        new StageData { StageName = "Lod Apartment",                  RequiredFollowers = 0,         TransitionCost = 2_500 },
        new StageData { StageName = "Rishon LeZion",                  RequiredFollowers = 1_000,     TransitionCost = 35_000 },
        new StageData { StageName = "Gag Apartment & Shopify Store",  RequiredFollowers = 30_000,    TransitionCost = 400_000 },
        new StageData { StageName = "Tel Aviv Penthouse",             RequiredFollowers = 250_000,   TransitionCost = 3_000_000 },
        new StageData { StageName = "Herzliya Villa & Porsche",       RequiredFollowers = 1_500_000, TransitionCost = 0 },
    };

    /// <summary>
    /// Returns the highest stage the player has unlocked based on their follower count.
    /// </summary>
    public static StageData GetCurrentStage(double followers)
    {
        StageData current = Stages[0];
        foreach (StageData stage in Stages)
        {
            if (followers >= stage.RequiredFollowers)
                current = stage;
            else
                break;
        }
        return current;
    }

    /// <summary>
    /// Returns the next stage, or null if the player is at max stage.
    /// </summary>
    public static StageData GetNextStage(double followers)
    {
        for (int i = 0; i < Stages.Length - 1; i++)
        {
            if (followers < Stages[i + 1].RequiredFollowers)
                return Stages[i + 1];
        }
        return null; // Already at max stage.
    }
}
