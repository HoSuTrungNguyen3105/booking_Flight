import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Plus, Trash } from "lucide-react";
import { nowDecimal } from "../../hooks/format";

export interface CreateDiscountReq {
  code: string;
  description?: string;
  discountAmount?: number;
  discountPercent?: number;
  isPercentage: boolean;
  active: boolean;
  usageLimit?: number;
  validFrom: number;
  validTo: number;
}

interface DiscountBatchCreatorProps {
  onClose: () => void;
  createBatchDiscount: (
    discounts: CreateDiscountReq[]
  ) => Promise<{ resultCode: string; list?: any[] }>;
}

const DEFAULT_DISCOUNT: CreateDiscountReq = {
  code: "",
  description: "",
  discountAmount: 0,
  discountPercent: 0,
  isPercentage: false,
  active: true,
  usageLimit: 0,
  validFrom: nowDecimal(),
  validTo: Date.now() + 7 * 24 * 60 * 60 * 1000,
};

export const DiscountBatchCreator: React.FC<DiscountBatchCreatorProps> = ({
  onClose,
  createBatchDiscount,
}) => {
  const [discounts, setDiscounts] = useState<CreateDiscountReq[]>([
    DEFAULT_DISCOUNT,
  ]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (index: number, field: keyof CreateDiscountReq, value: any) => {
      setDiscounts((prev) =>
        prev.map((discount, i) =>
          i === index ? { ...discount, [field]: value } : discount
        )
      );
    },
    []
  );

  const handleAddDiscount = () =>
    setDiscounts((prev) => [...prev, DEFAULT_DISCOUNT]);

  const handleRemoveDiscount = (index: number) => {
    setDiscounts((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await createBatchDiscount(discounts);
      if (res?.resultCode === "00") {
        const errorMap: Record<number, string> = {};
        const newDiscounts = discounts.map((d, idx) => {
          const item = res.list?.[idx];
          if (item?.errorCode !== "SUCCESS") {
            errorMap[idx] = item?.errorMessage || "Unknown error";
            return d;
          }
          return DEFAULT_DISCOUNT;
        });
        setDiscounts(newDiscounts);
        setErrors(errorMap);
        if (Object.keys(errorMap).length === 0) onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Create Discount Codes in Bulk
      </Typography>

      {discounts.map((d, idx) => (
        <Card
          key={idx}
          sx={{ mb: 2, border: "1px solid #ddd", borderRadius: 2 }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Code"
                  value={d.code}
                  onChange={(e) =>
                    handleChange(idx, "code", e.target.value.toUpperCase())
                  }
                  error={!!errors[idx]}
                  helperText={errors[idx]}
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Description"
                  value={d.description}
                  onChange={(e) =>
                    handleChange(idx, "description", e.target.value)
                  }
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  label={d.isPercentage ? "Discount (%)" : "Discount Amount"}
                  type="number"
                  value={d.isPercentage ? d.discountPercent : d.discountAmount}
                  onChange={(e) =>
                    handleChange(
                      idx,
                      d.isPercentage ? "discountPercent" : "discountAmount",
                      Number(e.target.value)
                    )
                  }
                />
              </Grid>
              <Grid size={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={d.isPercentage}
                      onChange={(e) =>
                        handleChange(idx, "isPercentage", e.target.checked)
                      }
                    />
                  }
                  label="Is Percentage"
                />
              </Grid>

              <Grid size={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={d.active}
                      onChange={(e) =>
                        handleChange(idx, "active", e.target.checked)
                      }
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Usage Limit"
                  type="number"
                  value={d.usageLimit}
                  onChange={(e) =>
                    handleChange(idx, "usageLimit", Number(e.target.value))
                  }
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Valid From"
                  type="datetime-local"
                  value={new Date(d.validFrom).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    handleChange(
                      idx,
                      "validFrom",
                      new Date(e.target.value).getTime()
                    )
                  }
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  fullWidth
                  label="Valid To"
                  type="datetime-local"
                  value={new Date(d.validTo).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    handleChange(
                      idx,
                      "validTo",
                      new Date(e.target.value).getTime()
                    )
                  }
                />
              </Grid>

              <Grid size={12} display="flex" justifyContent="flex-end">
                <Button
                  color="error"
                  startIcon={<Trash size={16} />}
                  onClick={() => handleRemoveDiscount(idx)}
                  disabled={discounts.length === 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box display="flex" gap={2} mt={2}>
        <Button
          variant="outlined"
          startIcon={<Plus size={16} />}
          onClick={handleAddDiscount}
        >
          Add Discount
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};
