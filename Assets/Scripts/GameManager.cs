using System;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    public double CurrentMoney { get; private set; }
    public double MoneyPerSecond { get; private set; }

    public event Action OnMoneyChanged;

    [SerializeField] private double baseClickValue = 1.0;

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

    private void Update()
    {
        if (MoneyPerSecond > 0)
        {
            AddMoney(MoneyPerSecond * Time.deltaTime);
        }
    }

    public void ClickAction()
    {
        AddMoney(baseClickValue);
    }

    public void AddMoney(double amount)
    {
        CurrentMoney += amount;
        OnMoneyChanged?.Invoke();
    }

    public bool SpendMoney(double amount)
    {
        if (CurrentMoney < amount) return false;
        CurrentMoney -= amount;
        OnMoneyChanged?.Invoke();
        return true;
    }

    public void AddMoneyPerSecond(double amount)
    {
        MoneyPerSecond += amount;
        OnMoneyChanged?.Invoke();
    }

    public void SetMoney(double money, double mps)
    {
        CurrentMoney = money;
        MoneyPerSecond = mps;
        OnMoneyChanged?.Invoke();
    }
}
