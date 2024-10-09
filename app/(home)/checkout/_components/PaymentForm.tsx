"use client"

import { useForm, Controller, Control, FieldValues, FieldErrors } from 'react-hook-form'
import { Input, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import Image from 'next/image'
import mastercardLogo from "~/assets/checkout/mastercard.png";
import visaLogo from "~/assets/checkout/visa.jpg";
import americanExpressLogo from "~/assets/checkout/american_express.png";

type PaymentData = {
    cardNumber: string
    expiration: string
    cvc: string
}

interface PaymentFormProps {
    control: Control<FieldValues, any>
    errors: FieldErrors<PaymentData>
}


export default function PaymentForm({ control, errors }: PaymentFormProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-xl font-semibold mb-4">Complete your subscription purchase</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card number
                    </label>
                    <Controller
                        name="cardNumber"
                        control={control}
                        rules={{
                            required: "Card number is required", pattern: {
                                value: /^[0-9]{16}$/,
                                message: "Please enter a valid 16-digit card number"
                            }
                        }}
                        render={({ field }) => (
                            <>
                                <Input
                                    {...field}
                                    id="cardNumber"
                                    className="w-full border-gray-300 rounded-md"
                                    placeholder="1234 1234 1234 1234"
                                    suffix={
                                        <div className="flex space-x-2">
                                            <Image src={visaLogo} height={20} width={20} alt="Visa" />
                                            <Image src={mastercardLogo} height={20} width={20} alt="Mastercard" />
                                            <Image src={americanExpressLogo} height={20} width={20} alt="American Express" />
                                        </div>
                                    }
                                />
                            </>
                        )}
                    />
                    {errors.cardNumber && <p className="mt-1 text-xs text-red-600">{errors.cardNumber.message}</p>}
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration
                        </label>
                        <Controller
                            name="expiration"
                            control={control}
                            rules={{
                                required: "Expiration date is required", pattern: {
                                    value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                                    message: "Please enter a valid expiration date (MM/YY)"
                                }
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="expiration"
                                    className="w-full border-gray-300 rounded-md"
                                    placeholder="MM / YY"
                                />
                            )}
                        />
                        {errors.expiration && <p className="mt-1 text-xs text-red-600">{errors.expiration.message}</p>}
                    </div>
                    <div className="flex-1">
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                            CVC
                            <Tooltip title="The 3 or 4-digit security code on your card">
                                <QuestionCircleOutlined className="ml-1 text-gray-400" />
                            </Tooltip>
                        </label>
                        <Controller
                            name="cvc"
                            control={control}
                            rules={{
                                required: "CVC is required", pattern: {
                                    value: /^[0-9]{3,4}$/,
                                    message: "Please enter a valid 3 or 4-digit CVC"
                                }
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="cvc"
                                    className="w-full border-gray-300 rounded-md"
                                    placeholder="CVC"
                                />
                            )}
                        />
                        {errors.cvc && <p className="mt-1 text-xs text-red-600">{errors.cvc.message}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}