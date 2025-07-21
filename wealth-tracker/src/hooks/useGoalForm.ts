import { useState, useEffect } from "react";
import { GoalData } from "../types/types";
import { MoneyLocationData } from "../types/money-location-types";
import { Currency } from "../utils/currency-utils";

interface UseGoalFormProps {
  goal?: GoalData | null;
  userName: string;
  moneyLocations: MoneyLocationData[];
  onSubmit: (
    goalData: Omit<GoalData, "goal_id" | "created_at" | "updated_at">
  ) => Promise<boolean>;
  onClose: () => void;
}

export function useGoalForm({
  goal,
  userName,
  moneyLocations,
  onSubmit,
  onClose,
}: UseGoalFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    target_amount: "",
    current_amount: "",
    deadline: "",
    category: "",
    currency: "USD",
    description: "",
    money_location_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        target_amount: goal.target_amount.toString(),
        current_amount: goal.current_amount.toString(),
        deadline: goal.deadline.split("T")[0],
        category: goal.category,
        currency: goal.currency || "USD",
        description: goal.description || "",
        money_location_id: goal.money_location_id || "",
      });
    } else {
      setFormData({
        name: "",
        target_amount: "",
        current_amount: "0",
        deadline: "",
        category: "Safety",
        currency: "USD",
        description: "",
        money_location_id: "",
      });
    }
    setError("");
  }, [goal]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name || !formData.target_amount || !formData.deadline) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Find the selected money location for name reference
      const selectedMoneyLocation = formData.money_location_id
        ? moneyLocations.find(
            (ml) => ml.money_location_id === formData.money_location_id
          )
        : null;

      // If connected to a money location, use its current amount as the goal's current amount
      const currentAmount = selectedMoneyLocation
        ? selectedMoneyLocation.amount
        : parseFloat(formData.current_amount) || 0;

      const goalData = {
        user_id: userName,
        name: formData.name,
        target_amount: parseFloat(formData.target_amount),
        current_amount: currentAmount,
        deadline: formData.deadline,
        category: formData.category,
        currency: formData.currency as Currency, // Goal's own currency
        description: formData.description,
        money_location_id: formData.money_location_id || undefined,
        money_location_name: selectedMoneyLocation?.location_name || undefined,
      };

      const success = await onSubmit(goalData);
      if (success) {
        onClose();
      }
    } catch (error) {
      setError("An error occurred while saving the goal");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    // Auto-fill currency when money location is selected
    if (name === "money_location_id" && value) {
      const selectedLocation = moneyLocations.find(
        (location) => location.money_location_id === value
      );
      if (selectedLocation) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          currency: selectedLocation.currency,
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return {
    formData,
    isSubmitting,
    error,
    handleSubmit,
    handleChange,
  };
}
