import React, { useState } from 'react';
import { Download, RefreshCw, Calendar, User, Target, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { DietPlanResponse } from '../types';
import jsPDF from 'jspdf';

interface DietPlanProps {
  plan: DietPlanResponse;
  onNewPlan: () => void;
}

const DietPlan: React.FC<DietPlanProps> = ({ plan, onNewPlan }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Personalized Diet Plan', margin, yPosition);
    yPosition += 15;

    // Date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${new Date(plan.timestamp).toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    // User Info
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Personal Information', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const userInfo = [
      `Age: ${plan.userData.age} years`,
      `Height: ${plan.userData.height} cm`,
      `Current Weight: ${plan.userData.currentWeight} kg`,
      `Target Weight: ${plan.userData.targetWeight} kg`,
      `BMI: ${plan.bmiData.bmi.toFixed(1)} (${plan.bmiData.category})`,
      `Goal: ${plan.userData.fitnessGoal.replace('_', ' ')}`,
      `Diet Preference: ${plan.userData.dietaryPreference}`,
    ];

    userInfo.forEach(info => {
      pdf.text(info, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Diet Plan Content
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Diet Plan', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    const lines = pdf.splitTextToSize(plan.aiResponse, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 5;
    });

    pdf.save('diet-plan.pdf');
  };

  const formatAIResponse = (response: string) => {
    const sections = response.split(/(?=\*\*[A-Z][^*]*\*\*)/);
    return sections.filter(section => section.trim());
  };

  const extractSectionTitle = (section: string) => {
    const match = section.match(/\*\*([^*]+)\*\*/);
    return match ? match[1] : 'Content';
  };

  const cleanSectionContent = (section: string) => {
    return section.replace(/\*\*[^*]+\*\*/, '').trim();
  };

  const sections = formatAIResponse(plan.aiResponse);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="card p-8 gradient-bg text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Personalized Diet Plan</h1>
            <p className="text-lg opacity-90">
              Generated on {new Date(plan.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={downloadPDF}
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onNewPlan}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <User className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {plan.bmiData.bmi.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            BMI ({plan.bmiData.category})
          </div>
        </div>

        <div className="card p-6 text-center">
          <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {Math.abs(plan.userData.currentWeight - plan.userData.targetWeight)} kg
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Weight Goal
          </div>
        </div>

        <div className="card p-6 text-center">
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {plan.bmiData.estimatedGoalDate}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Target Date
          </div>
        </div>

        <div className="card p-6 text-center">
          <Droplets className="w-8 h-8 text-cyan-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {plan.userData.waterIntake}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Glasses/Day
          </div>
        </div>
      </div>

      {/* Diet Plan Content */}
      <div className="space-y-4">
        {sections.map((section, index) => {
          const title = extractSectionTitle(section);
          const content = cleanSectionContent(section);
          const sectionKey = `section-${index}`;
          const isExpanded = expandedSections.has(sectionKey);

          return (
            <div key={index} className="card overflow-hidden">
              <button
                onClick={() => toggleSection(sectionKey)}
                className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="pt-4 prose prose-gray dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
                      {content}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-8">
        <button
          onClick={downloadPDF}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download as PDF</span>
        </button>
        <button
          onClick={onNewPlan}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate New Plan</span>
        </button>
      </div>
    </div>
  );
};

export default DietPlan;