"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

// Схема валидации с Zod
const formSchema = z.object({
  user_id: z.number().min(1, "User ID обязателен"),
  nm_id: z.number().min(1, "Product ID обязателен"),
  created_date: z.string().min(1, "Дата обязательна"),
  service: z.enum(["nnsz", "ordo"]),
  total_ordered: z.number().min(1, "Количество должно быть больше 0"),
  payment_type: z.enum(["CSH", "CRD", "BAL", "WPG"]),
  is_paid: z.boolean(),
  count_items: z.number().min(0),
  unique_items: z.number().min(0),
  avg_unique_purchase: z.number().min(0),
  is_courier: z.number().min(0).max(1),
  nm_age: z.number().min(0),
  distance: z.number().min(0),
  days_after_registration: z.number().min(0),
  number_of_orders: z.number().min(0),
  number_of_ordered_items: z.number().min(0),
  mean_number_of_ordered_items: z.number().min(0),
  min_number_of_ordered_items: z.number().min(0),
  max_number_of_ordered_items: z.number().min(0),
  mean_percent_of_ordered_items: z.number().min(0).max(100),
})

export function FraudDetectionForm() {
  const [result, setResult] = useState<{
    prediction: number
    confidence: number
    is_fraud: boolean
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: 35434,
      nm_id: 37225,
      created_date: "2025-03-02T16:13:47+03:00",
      service: "nnsz",
      total_ordered: 854,
      payment_type: "CSH",
      is_paid: false,
      count_items: 0,
      unique_items: 0,
      avg_unique_purchase: 0,
      is_courier: 0,
      nm_age: 114,
      distance: 913,
      days_after_registration: 1078,
      number_of_orders: 1,
      number_of_ordered_items: 854,
      mean_number_of_ordered_items: 854,
      min_number_of_ordered_items: 854,
      max_number_of_ordered_items: 854,
      mean_percent_of_ordered_items: 100,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Fraud Detection System</CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User ID */}
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product ID */}
          <FormField
            control={form.control}
            name="nm_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product ID</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Created Date */}
          <FormField
            control={form.control}
            name="created_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Created Date</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Service Region */}
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Region</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nnsz">NNSZ</SelectItem>
                    <SelectItem value="ordo">ORDO</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Ordered */}
          <FormField
            control={form.control}
            name="total_ordered"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Ordered</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Type */}
          <FormField
            control={form.control}
            name="payment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CRD">Credit Card</SelectItem>
                    <SelectItem value="BAL">Balance</SelectItem>
                    <SelectItem value="WPG">Wire Payment</SelectItem>
                    <SelectItem value="CSH">Cash</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Paid */}
          <FormField
            control={form.control}
            name="is_paid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Payment Status</FormLabel>
                  <FormDescription>
                    Is the order already paid?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Count Items */}
          <FormField
            control={form.control}
            name="count_items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Count Items</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unique Items */}
          <FormField
            control={form.control}
            name="unique_items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unique Items</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Avg Unique Purchase */}
          <FormField
            control={form.control}
            name="avg_unique_purchase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avg Unique Purchase</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Courier */}
          <FormField
            control={form.control}
            name="is_courier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Method</FormLabel>
                <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Pickup Point</SelectItem>
                    <SelectItem value="1">Courier</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* NM Age */}
          <FormField
            control={form.control}
            name="nm_age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Age (days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Distance */}
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance (km)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Days After Registration */}
          <FormField
            control={form.control}
            name="days_after_registration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Days After Registration</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Orders */}
          <FormField
            control={form.control}
            name="number_of_orders"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Orders</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Ordered Items */}
          <FormField
            control={form.control}
            name="number_of_ordered_items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Ordered Items</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mean Number of Ordered Items */}
          <FormField
            control={form.control}
            name="mean_number_of_ordered_items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mean Ordered Items</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Min Number of Ordered Items */}
          <FormField
            control={form.control}
            name="min_number_of_ordered_items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Ordered Items</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Max Number of Ordered Items */}
          <FormField
            control={form.control}
            name="max_number_of_ordered_items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Ordered Items</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mean Percent of Ordered Items */}
          <FormField
            control={form.control}
            name="mean_percent_of_ordered_items"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mean Percent Ordered</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Percentage value (0-100)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Check for Fraud'
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className={result.is_fraud ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
                <AlertTitle>
                  {result.is_fraud ? 'Fraud Detected!' : 'Legitimate Order'}
                </AlertTitle>
                <AlertDescription>
                  Confidence: {(result.confidence * 100).toFixed(2)}%
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}