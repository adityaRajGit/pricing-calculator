import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

interface PricingFormData {
  productCategory: string;
  productSize: string;
  location: string;
  shippingMode: string;
  serviceLevel: string;
  sellingPrice: number;
  weight: number;
}

// Custom error class
class FetchError extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

const categories = [
  'Automotive - Helmets & Riding Gloves',
  'Automotive - Tyres & Rims',
  'Automotive Vehicles',
  'Baby - Hardlines',
  'Baby - Strollers',
  'Baby - Diapers',
  'Books'
];

const PricingCalculator: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PricingFormData>({
    productCategory: categories[0], // Set default value to first category
    productSize: 'Standard',
    location: 'Local',
    shippingMode: 'Easy Ship',
    serviceLevel: 'Standard',
    sellingPrice: 0,
    weight: 0
  });

  const [results, setResults] = useState<any>(null);

  const calculateTotalFees = async (formData: PricingFormData): Promise<any> => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/profitability-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new FetchError(`HTTP error! status: ${response.status}`, response);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error calculating fees:', error);
      if (error instanceof FetchError) {
        setError(`Failed to calculate fees: ${error.message}`);
      } else {
        setError('An unexpected error occurred');
      }
      throw error;
    }
  };

  const handleCalculate = async () => {
    try {
      setError(null);
      if (!formData.productCategory || !formData.productSize || !formData.location) {
        setError('Please fill in all required fields');
        return;
      }
      const result = await calculateTotalFees(formData);
      setResults(result);
    } catch (error) {
      console.error('Error in handleCalculate:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sellingPrice' || name === 'weight' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Amazon Pricing Calculator</h1>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category *
                </label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Mode *
                  </label>
                  <select
                    name="shippingMode"
                    value={formData.shippingMode}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>Easy Ship</option>
                    <option>FBA</option>
                    <option>Self Ship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Level *
                  </label>
                  <select
                    name="serviceLevel"
                    value={formData.serviceLevel}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>Premium</option>
                    <option>Advanced</option>
                    <option>Standard</option>
                    <option>Basic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Size *
                  </label>
                  <select
                    name="productSize"
                    value={formData.productSize}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>Standard</option>
                    <option>Heavy & Bulky</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>Local</option>
                    <option>Regional</option>
                    <option>National</option>
                    <option>IXD</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Calculate Fees
              </button>
            </div>

            {results && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Fee Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referral Fee:</span>
                    <span className="font-medium">₹{results.referralFee?.toFixed(2) ?? 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight Handling Fee:</span>
                    <span className="font-medium">₹{results.weightHandlingFee?.toFixed(2) ?? 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Closing Fee:</span>
                    <span className="font-medium">₹{results.closingFee?.toFixed(2) ?? 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pick & Pack Fee:</span>
                    <span className="font-medium">₹{results.pickAndPackFee?.toFixed(2) ?? 'N/A'}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-4"></div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total Fees:</span>
                    <span className="text-blue-600">₹{results.totalFees?.toFixed(2) ?? 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Net Earnings:</span>
                    <span className="text-green-600">₹{results.netEarnings?.toFixed(2) ?? 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;