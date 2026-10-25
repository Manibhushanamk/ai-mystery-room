import type { IMysteryCase } from '../../models/MysteryCase.js';

export class MockCaseGenerator {
  public static generate(params: {
    ownerId: string;
    scenario: string;
    genre?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    setting?: string;
  }): Partial<IMysteryCase> {
    const genre = (params.genre || 'campus') as any;
    const difficulty = params.difficulty || 'medium';
    const setting = params.setting || 'Apex Advanced Research Laboratory, Campus North';

    return {
      ownerId: params.ownerId,
      title: 'The Quantum Core Breach',
      scenarioSeed: params.scenario,
      genre,
      difficulty,
      setting,
      status: 'ready',
      publicCase: {
        premise:
          'A proprietary quantum computing core was stolen from the high-security basement vault of Apex Laboratory the night before its first public demonstration.',
        incidentSummary:
          'At 22:42 on Friday night, the secondary containment vault was breached without triggering the master siren. The primary cooling cradle was emptied, and the perpetrator departed unseen before night patrols noticed the open vault door at 23:15.',
        incidentTime: '2026-10-24T22:42:00.000Z',
        briefing:
          'Senior Investigator Memo: Access to Vault B requires level-4 authorization or physical administrative contractor bypass. Three department members and one external contractor had scheduled facility access that evening. Examine digital logs, witness interviews, and surveillance transcripts to identify who removed the core.',
        suspects: [
          {
            id: 'suspect_01',
            name: 'Dr. Evelyn Vance',
            role: 'Lead Project Scientist',
            bio: 'Principal designer of the quantum core. Rumored to have severe disputes with university administration over patent royalties.',
            relationshipToIncident: 'Had primary biometric access to the vault enclosure.',
            publicMotive: 'Frustrated over royalty disputes and potential patent cancellation.',
            statedAlibi: 'Claims she was attending a keynote dinner symposium in downtown New York until midnight.',
          },
          {
            id: 'suspect_02',
            name: 'Marcus Wright',
            role: 'Security Systems Contractor',
            bio: 'Senior systems technician hired to update the vault door firmware and camera telemetry throughout October.',
            relationshipToIncident: 'Issued an administrative maintenance badge (Card #408) for testing sensor loops.',
            publicMotive: 'Heavy personal debts following the liquidation of his previous cybersecurity firm.',
            statedAlibi: 'Claims he concluded maintenance at 21:30 and went home immediately afterward.',
          },
          {
            id: 'suspect_03',
            name: 'Elena Ramos',
            role: 'Graduate Research Fellow',
            bio: 'Final-year doctoral candidate whose thesis depends directly on the quantum core data demonstration.',
            relationshipToIncident: 'Last authorized student in the facility on Friday evening.',
            publicMotive: 'Faced imminent funding cuts if the preliminary demonstration proved underwhelming.',
            statedAlibi: 'Claims she was working in the 3rd floor computer annex until 22:30, then left for dinner.',
          },
          {
            id: 'suspect_04',
            name: 'Arthur Pendelton',
            role: 'Faculty Dean & Administrator',
            bio: 'Institutional sponsor overseeing lab commercialization and venture capital fundraising.',
            relationshipToIncident: 'Authorized budget allocations and monitored audit logs.',
            publicMotive: 'Under pressure from venture backers to deliver immediate commercial licensing results.',
            statedAlibi: 'Host of the downtown benefactor reception alongside university trustees.',
          },
        ],
        evidence: [
          {
            id: 'evidence_01',
            type: 'chat',
            title: 'Encrypted Message Fragment (Telegram Export)',
            description: 'Recovered from an unlinked burner device discarded near the laboratory perimeter fence.',
            createdAtInStory: '2026-10-24T21:48:00.000Z',
            sourceLabel: 'Digital Forensics Recovery Log',
            reliability: 'high',
            content: {
              participants: [
                { id: 'user_408', name: 'M.W. (Anonymous)' },
                { id: 'buyer_prime', name: 'Offshore Broker' },
              ],
              messages: [
                {
                  senderId: 'user_408',
                  senderName: 'M.W.',
                  timestamp: '21:48',
                  text: 'Firmware patch is uploaded. The secondary loop will bypass vault alarms for an 8-minute window at 22:40.',
                },
                {
                  senderId: 'buyer_prime',
                  senderName: 'Offshore Broker',
                  timestamp: '21:50',
                  text: 'Escrow is locked. Extract the unit and deliver to the rear service gate by 23:00 sharp.',
                },
              ],
            },
            fictionalLabel: 'FICTIONAL_SIMULATION',
          },
          {
            id: 'evidence_02',
            type: 'camera_log',
            title: 'Sub-Basement Corridor Access Log & Camera Transcript',
            description: 'Automated event log recorded at Sub-Basement Corridor 02 (Vault Access Corridor).',
            createdAtInStory: '2026-10-24T22:42:15.000Z',
            sourceLabel: 'Facility Security Server Telemetry',
            reliability: 'high',
            content: {
              cameraCode: 'CAM-B02',
              location: 'Sub-Basement Vault Entrance',
              eventTime: '22:42:15',
              observations: [
                'Door lock activated via Contractor Maintenance Keycard #408.',
                'Individual in gray contractor coveralls and cap enters vault ante-room.',
                'Motion sensor logged 2 minutes 45 seconds of physical movement inside containment chamber.',
                'Perpetrator exits carrying insulated silver transport canister.',
              ],
              stillSnapshotSummary: 'Frame shows individual matching height 183cm, wearing Apex Facilities uniform with Contractor Badge #408 visible on lanyard.',
            },
            fictionalLabel: 'FICTIONAL_SIMULATION',
          },
          {
            id: 'evidence_03',
            type: 'witness_statement',
            title: 'Witness Interview: Elena Ramos',
            description: 'Statement given to campus security officers at 23:35 on Friday night.',
            createdAtInStory: '2026-10-24T23:35:00.000Z',
            sourceLabel: 'Investigator Interview Recording',
            reliability: 'medium',
            content: {
              witnessName: 'Elena Ramos',
              interviewTime: '23:35',
              interviewer: 'Officer J. Miller',
              statementTranscript:
                'I had left the annex to grab takeout around 22:35. Walking past the loading bay around 22:50, I heard an engine idling. A gray utility van sped out with its headlights switched off. I thought it was just the regular weekend linen or facilities crew.',
              keyClaims: [
                'Saw gray utility van departure from rear dock at 22:50.',
                'Noticed headlights were kept off until the vehicle reached Oak Street.',
              ],
            },
            fictionalLabel: 'FICTIONAL_SIMULATION',
          },
          {
            id: 'evidence_04',
            type: 'document',
            title: 'Turnstile Badge Audit Report: Main Gate & Annex',
            description: 'Automated gate check records for Friday evening (21:00 - 23:30).',
            createdAtInStory: '2026-10-24T23:45:00.000Z',
            sourceLabel: 'Campus Access Control Database',
            reliability: 'high',
            content: {
              documentTitle: 'Campus Entry/Exit Electronic Audit',
              issuer: 'Campus Physical Security Department',
              dateIssued: '2026-10-24',
              bodySections: [
                {
                  header: 'Card #119 (Elena Ramos)',
                  content: 'Exit at Main Turnstile: 22:32. Re-entry at Main Turnstile: 23:05 with food receipt.',
                },
                {
                  header: 'Card #002 (Dr. Evelyn Vance)',
                  content: 'No badge swipes recorded after 14:10.',
                },
                {
                  header: 'Card #408 (Marcus Wright)',
                  content: 'Initial tap-in at 19:15. Internal door activations: 21:10, 22:42. Exit gate tap: 22:53.',
                },
              ],
            },
            fictionalLabel: 'FICTIONAL_SIMULATION',
          },
          {
            id: 'evidence_05',
            type: 'document',
            title: 'Quantum Core Physical Inventory Manifest',
            description: 'Technical specification and custody sheet for Unit QC-09.',
            createdAtInStory: '2026-10-24T23:55:00.000Z',
            sourceLabel: 'Apex Lab Material Custody Registry',
            reliability: 'high',
            content: {
              documentTitle: 'Custody & Spec Sheet: Cryogenic Core Unit QC-09',
              issuer: 'Apex Quantum Physics Group',
              dateIssued: '2026-10-24',
              bodySections: [
                {
                  header: 'Thermal Warning',
                  content: 'QC-09 must remain inside an insulated cryo-canister; exceeding 4 degrees Celsius will degrade crystalline quantum registers.',
                },
                {
                  header: 'Security Seal',
                  content: 'Requires dual-key cryptographic release or physical maintenance override key #M4.',
                },
              ],
            },
            fictionalLabel: 'FICTIONAL_SIMULATION',
          },
          {
            id: 'evidence_06',
            type: 'camera_log',
            title: 'Rear Service Dock Gate Automatic Plate Recognition (ALPR)',
            description: 'Automated barrier gate camera capture on Service Road West.',
            createdAtInStory: '2026-10-24T22:54:10.000Z',
            sourceLabel: 'Campus Perimeter Security Camera 09',
            reliability: 'high',
            content: {
              cameraCode: 'CAM-EXT-09',
              location: 'Rear Loading Dock Gate',
              eventTime: '22:54:02',
              observations: [
                'Gate arm raised via Contractor Transponder #408.',
                'Vehicle: 2018 Ford Transit Connect (Slate Gray), Plate #7XYZ-91.',
                'Driver observed wearing baseball cap and reflective safety vest.',
              ],
              stillSnapshotSummary: 'Plate #7XYZ-91 registered in contractor vendor database to Marcus Wright d/b/a Wright Industrial Electronics.',
            },
            fictionalLabel: 'FICTIONAL_SIMULATION',
          },
          {
            id: 'evidence_07',
            type: 'witness_statement',
            title: 'Witness Statement: Dean Arthur Pendelton',
            description: 'Interview transcript conducted at Downtown Harvard Club at 00:30.',
            createdAtInStory: '2026-10-25T00:30:00.000Z',
            sourceLabel: 'Investigator Interview Recording',
            reliability: 'medium',
            content: {
              witnessName: 'Arthur Pendelton',
              interviewTime: '00:30',
              interviewer: 'Detective Vance',
              statementTranscript:
                'Dr. Vance was extremely agitated during our quarterly review on Tuesday. She threatened to halt the demo unless her intellectual property stake was quadrupled. I implore you to look into her communications.',
              keyClaims: [
                'Claims Dr. Vance threatened demo sabotage earlier in the week.',
                'Stated he remained at the symposium reception with 40 trustees all evening.',
              ],
            },
            fictionalLabel: 'FICTIONAL_SIMULATION',
          },
          {
            id: 'evidence_08',
            type: 'document',
            title: 'Airline Passenger & Boarding Verification: Dr. Evelyn Vance',
            description: 'Official airline carrier electronic boarding confirmation and passenger manifest.',
            createdAtInStory: '2026-10-24T23:10:00.000Z',
            sourceLabel: 'Federal Aviation Passenger Log',
            reliability: 'high',
            content: {
              documentTitle: 'Passenger Travel Verification',
              issuer: 'Delta Air Lines Flight Operations',
              dateIssued: '2026-10-24',
              bodySections: [
                {
                  header: 'Flight DL-4412 (BOS to LHR)',
                  content: 'Dr. Evelyn Vance checked in at Boston Logan International Airport at 16:45. Seat 03A. Flight airborne from 18:30 through arrival in London Heathrow.',
                },
              ],
            },
            fictionalLabel: 'FICTIONAL_SIMULATION',
          },
        ],
        timeline: [
          {
            id: 'time_01',
            time: '21:00',
            description: 'Main laboratory locked down for the weekend by facility staff.',
            verified: true,
          },
          {
            id: 'time_02',
            time: '21:48',
            description: 'Encrypted message sent regarding an 8-minute firmware bypass window.',
            verified: true,
            relatedEvidenceIds: ['evidence_01'],
          },
          {
            id: 'time_03',
            time: '22:32',
            description: 'Elena Ramos logs out and departs through main turnstiles for dinner.',
            verified: true,
            relatedSuspectIds: ['suspect_03'],
            relatedEvidenceIds: ['evidence_04'],
          },
          {
            id: 'time_04',
            time: '22:42',
            description: 'Contractor Keycard #408 unlocks Sub-Basement Vault door; quantum core removed.',
            verified: true,
            relatedSuspectIds: ['suspect_02'],
            relatedEvidenceIds: ['evidence_02'],
          },
          {
            id: 'time_05',
            time: '22:50',
            description: 'Elena Ramos spots gray utility vehicle idling near loading dock with lights dimmed.',
            verified: false,
            relatedSuspectIds: ['suspect_03'],
            relatedEvidenceIds: ['evidence_03'],
          },
          {
            id: 'time_06',
            time: '22:54',
            description: 'Plate recognition captures Marcus Wright van departing through rear service barrier.',
            verified: true,
            relatedSuspectIds: ['suspect_02'],
            relatedEvidenceIds: ['evidence_06'],
          },
          {
            id: 'time_07',
            time: '23:05',
            description: 'Elena Ramos swipes back in through main entrance turnstile carrying food.',
            verified: true,
            relatedSuspectIds: ['suspect_03'],
            relatedEvidenceIds: ['evidence_04'],
          },
          {
            id: 'time_08',
            time: '23:15',
            description: 'Night security patrol discovers Vault B open and issues general alert.',
            verified: true,
          },
        ],
      },
      privateSolution: {
        culpritSuspectId: 'suspect_02',
        motive:
          'Marcus Wright faced catastrophic personal bankruptcy following the collapse of his previous technology firm. He agreed to steal the prototype quantum core for an offshore corporate espionage consortium in exchange for a multimillion-dollar cryptocurrency bounty.',
        method:
          'Contracted to update vault security firmware, Marcus maliciously altered the sensor loop to disable silent panic telemetry for an 8-minute window at 22:40. He used his administrative keycard #408 to open the vault, transferred the cryogenic core into an insulated transport container, and fled out the rear service gate in his company utility van.',
        canonicalTimeline: [
          {
            time: '21:48',
            event: 'Marcus Wright confirms firmware bypass window with offshore buyer on encrypted burner phone.',
            involvedSuspectIds: ['suspect_02'],
          },
          {
            time: '22:42',
            event: 'Marcus taps Contractor Badge #408 into Vault B and extracts the quantum core.',
            involvedSuspectIds: ['suspect_02'],
          },
          {
            time: '22:54',
            event: 'Marcus drives through rear loading gate in registered van #7XYZ-91.',
            involvedSuspectIds: ['suspect_02'],
          },
        ],
        solutionExplanation:
          'Marcus Wright (Suspect 02) is the sole suspect whose presence and actions precisely fit all physical and digital evidence. His Contractor Keycard #408 was logged opening the vault at 22:42:15, directly matching the encrypted bypass window detailed in the recovered burner phone chat (Evidence 01). Surveillance footage (Evidence 02) captured a perpetrator wearing Marcus’s contractor badge and uniform leaving with the transport canister. Finally, automatic license plate recognition (Evidence 06) recorded his registered slate-gray van departing through the service gate at 22:54. Both alternative suspects are completely exculpated: Elena Ramos was verified exiting at 22:32 and returning at 23:05 with dinner (Evidence 04), while Dr. Evelyn Vance was demonstrably airborne on Flight DL-4412 en route to London (Evidence 08).',
        evidenceReasoning: [
          {
            evidenceId: 'evidence_01',
            explanation:
              'Chat message links keycard 408 to the scheduled firmware bypass window at 22:40.',
            supports: ['suspect_02'],
            effect: 'supports_culprit',
          },
          {
            evidenceId: 'evidence_02',
            explanation:
              'Corridor telemetry captures keycard 408 opening the vault at 22:42 and an individual in contractor uniform removing the canister.',
            supports: ['suspect_02'],
            effect: 'supports_culprit',
          },
          {
            evidenceId: 'evidence_04',
            explanation:
              'Campus audit confirms Marcus keycard tapped vault at 22:42, while exculpating Elena Ramos who was off campus from 22:32 to 23:05.',
            supports: ['suspect_02'],
            effect: 'supports_culprit',
          },
          {
            evidenceId: 'evidence_06',
            explanation:
              'Automated plate reader captures Marcus Wright’s registered van leaving the rear gate at 22:54.',
            supports: ['suspect_02'],
            effect: 'supports_culprit',
          },
          {
            evidenceId: 'evidence_08',
            explanation:
              'Exculpates Dr. Evelyn Vance by proving she was airborne on transatlantic flight DL-4412 during the theft.',
            supports: ['suspect_01'],
            effect: 'weakens_alternative',
          },
          {
            evidenceId: 'evidence_07',
            explanation:
              'Dean Pendelton’s statement casts suspicion on Dr. Vance, serving as a misleading red herring based on past verbal friction.',
            supports: ['suspect_01'],
            effect: 'red_herring',
          },
        ],
        debunkedRedHerrings: [
          {
            suspectId: 'suspect_01',
            explanation:
              'While Dean Pendelton claimed Dr. Vance threatened the demo, flight records prove she was over the Atlantic Ocean when the break-in occurred.',
          },
          {
            suspectId: 'suspect_03',
            explanation:
              'Elena Ramos was in the vicinity, but electronic turnstile logs prove she left before the vault breach and returned only after the van had fled.',
          },
        ],
      },
      generation: {
        stage: 'Case validated and ready',
        progress: 100,
        attempts: 1,
        model: 'mock-engine-v1',
        completedAt: new Date(),
      },
      playerState: {
        markedEvidenceIds: [],
        notes: [],
      },
    };
  }
}
