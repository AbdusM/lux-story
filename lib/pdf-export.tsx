/**
 * PDF Export for Skills-Based Career Profile
 * Evidence-first formatting - show what they DID, not just scores
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { SkillProfile } from './skill-profile-adapter';

// PDF styles matching evidence-first philosophy
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  skillBlock: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  skillName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  demonstration: {
    fontSize: 9,
    marginLeft: 10,
    marginBottom: 3,
    color: '#333',
  },
  careerBlock: {
    marginBottom: 12,
    padding: 10,
    border: '1 solid #ddd',
    borderRadius: 4,
  },
  careerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  careerDetail: {
    fontSize: 9,
    marginBottom: 2,
    color: '#555',
  },
  badge: {
    display: 'inline-block',
    padding: '3 8',
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: 3,
    fontSize: 8,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
  },
});

const formatSkillName = (skill: string): string => {
  return skill
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

const getReadinessText = (readiness: string): string => {
  switch (readiness) {
    case 'near_ready':
      return 'Near Ready';
    case 'skill_gaps':
      return 'Skill Gaps';
    case 'exploratory':
      return 'Exploratory';
    default:
      return 'Unknown';
  }
};

interface SkillsReportPDFProps {
  profile: SkillProfile;
}

export const SkillsReportPDF: React.FC<SkillsReportPDFProps> = ({ profile }) => {
  // Get top 5 skills for focused display
  const topSkills = Object.entries(profile.skills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{profile.userName}</Text>
          <Text style={styles.subtitle}>Skills-Based Career Profile</Text>
          <Text style={styles.subtitle}>Generated: {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Skills Section - Evidence First */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Skills Demonstrated</Text>
          {topSkills.map(([skillKey, score]) => {
            const demos = profile.skillDemonstrations[skillKey as keyof typeof profile.skillDemonstrations] || [];
            return (
              <View key={skillKey} style={styles.skillBlock}>
                <Text style={styles.skillName}>
                  {formatSkillName(skillKey)} - {Math.round(score * 100)}% Developed
                </Text>
                {demos.slice(0, 2).map((demo, idx) => (
                  <Text key={idx} style={styles.demonstration}>
                    • {demo.scene}: {demo.context}
                  </Text>
                ))}
              </View>
            );
          })}
        </View>

        {/* Career Matches Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Birmingham Career Pathways</Text>
          {profile.careerMatches.slice(0, 3).map((career) => (
            <View key={career.id} style={styles.careerBlock}>
              <Text style={styles.careerTitle}>
                {career.name} - {getReadinessText(career.readiness)}
              </Text>
              <Text style={styles.careerDetail}>
                Salary Range: ${career.salaryRange[0].toLocaleString()} - ${career.salaryRange[1].toLocaleString()}
              </Text>
              <Text style={styles.careerDetail}>
                Education Paths: {career.educationPaths.join(', ')}
              </Text>
              <Text style={styles.careerDetail}>
                Local Opportunities: {career.localOpportunities.slice(0, 3).join(', ')}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Steps Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Actions</Text>
          {profile.actionSteps.slice(0, 5).map((step, idx) => (
            <Text key={idx} style={styles.demonstration}>
              {idx + 1}. {step.action} ({step.timeframe})
            </Text>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Grand Central Terminus - Birmingham Career Exploration</Text>
          <Text>Skills-based profile generated from narrative exploration</Text>
        </View>
      </Page>
    </Document>
  );
};

// Helper function to generate and download PDF
export const downloadSkillsReport = async (profile: SkillProfile) => {
  const { pdf } = await import('@react-pdf/renderer');
  const blob = await pdf(<SkillsReportPDF profile={profile} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${profile.userName.replace(/\s+/g, '_')}_Career_Profile.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
